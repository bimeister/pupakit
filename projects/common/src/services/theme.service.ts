import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, pairwise, startWith, take } from 'rxjs/operators';
import { DARK_THEME_CLASS } from '../declarations/constants/dark-theme-class.const';
import { LIGHT_THEME_CLASS } from '../declarations/constants/light-theme-class.const';
import { Theme } from '../declarations/enums/theme.enum';

const THEME_CLASSES_MAP: Map<Theme, string> = new Map([
  [Theme.Light, LIGHT_THEME_CLASS],
  [Theme.Dark, DARK_THEME_CLASS],
]);

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeState$: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(Theme.Light);

  public readonly theme$: Observable<Theme> = this.themeState$.asObservable();
  public readonly reversedTheme$: Observable<Theme> = this.theme$.pipe(
    map((theme: Theme) => (theme === Theme.Light ? Theme.Dark : Theme.Light))
  );

  public readonly themeClass$: Observable<string> = this.theme$.pipe(
    map((theme: Theme) => THEME_CLASSES_MAP.get(theme))
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.subscription.add(this.produceThemeChanges());
  }

  public setTheme(theme: Theme): void {
    this.themeState$.next(theme);
  }

  public toggleTheme(): void {
    this.reversedTheme$.pipe(take(1)).subscribe((updatedTheme: Theme) => this.setTheme(updatedTheme));
  }

  private produceThemeChanges(): Subscription {
    return this.theme$
      .pipe(
        startWith(Theme.Light),
        pairwise(),
        map(([prevTheme, currentTheme]: [Theme, Theme]) => [
          THEME_CLASSES_MAP.get(prevTheme),
          THEME_CLASSES_MAP.get(currentTheme),
        ])
      )
      .subscribe(([prevTheme, theme]: [string | undefined, string | undefined]) =>
        this.setHtmlClassesByTheme([prevTheme, theme])
      );
  }

  private setHtmlClassesByTheme([prevTheme, theme]: [string | undefined, string | undefined]): void {
    if (isNil(this.document)) {
      return;
    }

    const html: HTMLElement = this.document.body.parentElement;

    html.classList.add(theme);
    if (isNil(prevTheme) || isNil(theme) || prevTheme === theme) {
      return;
    }
    html.classList.remove(prevTheme);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DARK_THEME_CLASS } from '../../../../internal/constants/dark-theme-class.const';
import { Theme } from '../../../../internal/declarations/enums/theme.enum';

@Injectable()
export class ThemeWrapperService {
  private readonly themeState$: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(Theme.Light);

  public readonly theme$: Observable<Theme> = this.themeState$.asObservable();

  public readonly themeClass$: Observable<string> = this.theme$.pipe(
    map((theme: Theme) => (theme === Theme.Dark ? DARK_THEME_CLASS : ''))
  );

  public setTheme(theme: Theme): void {
    this.themeState$.next(theme);
  }
}

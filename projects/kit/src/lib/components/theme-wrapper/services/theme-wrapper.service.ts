import { Injectable } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DARK_THEME_CLASS } from '../../../../internal/constants/dark-theme-class.const';
import { LIGHT_THEME_CLASS } from '../../../../internal/constants/light-theme-class.const';
import { Theme } from '../../../../internal/declarations/enums/theme.enum';
import { ThemeService } from '../../../../internal/shared/services/theme.service';

@Injectable()
export class ThemeWrapperService {
  private readonly themeState$: BehaviorSubject<Nullable<Theme>> = new BehaviorSubject<Nullable<Theme>>(null);

  public readonly theme$: Observable<Theme> = combineLatest([this.themeService.theme$, this.themeState$]).pipe(
    map(([globalTheme, localTheme]: [Theme, Theme]) => localTheme ?? globalTheme)
  );

  public readonly themeClass$: Observable<string> = this.theme$.pipe(
    map((theme: Theme) => (theme === Theme.Dark ? DARK_THEME_CLASS : LIGHT_THEME_CLASS))
  );

  constructor(private readonly themeService: ThemeService) {}

  public setTheme(theme: Theme): void {
    this.themeState$.next(theme);
  }
}

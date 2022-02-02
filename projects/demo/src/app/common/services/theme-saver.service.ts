import { Injectable } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';

const THEME_MODE_KEY: string = 'theme-mode';

@Injectable({
  providedIn: 'root',
})
export class ThemeSaverService {
  public getTheme(): Theme {
    const item: string | null = localStorage.getItem(THEME_MODE_KEY);

    if (!isNil(item)) {
      return item as Theme;
    }

    return Theme.Light;
  }

  public setTheme(theme: Theme): void {
    localStorage.setItem(THEME_MODE_KEY, theme);
  }
}

import { Injectable } from '@angular/core';
import { Theme } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';

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

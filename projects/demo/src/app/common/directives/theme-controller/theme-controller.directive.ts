import { Directive, OnDestroy } from '@angular/core';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { ThemeService } from '@kit/internal/shared/services/theme.service';
import { Subscription } from 'rxjs';
import { ThemeSaverService } from '../../services/theme-saver.service';

@Directive({
  selector: '[demoThemeController]',
})
export class ThemeControllerDirective implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly themeService: ThemeService, private readonly themeSaverService: ThemeSaverService) {
    this.setSavedTheme();

    this.subscription.add(this.saveThemeWhenItChanged());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setSavedTheme(): void {
    const theme: Theme = this.themeSaverService.getTheme();

    this.themeService.setTheme(theme);
  }

  private saveThemeWhenItChanged(): Subscription {
    return this.themeService.theme$.subscribe((theme: Theme) => {
      this.themeSaverService.setTheme(theme);
    });
  }
}

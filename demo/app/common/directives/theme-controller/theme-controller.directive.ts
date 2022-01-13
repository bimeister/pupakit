import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Theme } from '../../../../../src/internal/declarations/enums/theme.enum';
import { AlertsService } from '../../../../../src/internal/shared/services/alerts.service';
import { ToastsService } from '../../../../../src/internal/shared/services/toasts.service';
import { ThemeWrapperService } from '../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { ThemeSaverService } from '../../services/theme-saver.service';

@Directive({
  selector: '[demoThemeController]',
})
export class ThemeControllerDirective implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly themeWrapperService: ThemeWrapperService,
    private readonly themeSaverService: ThemeSaverService,
    private readonly alertsService: AlertsService,
    private readonly toastsService: ToastsService
  ) {
    this.setSavedTheme();

    this.subscription.add(this.saveThemeWhenItChanged());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setSavedTheme(): void {
    const theme: Theme = this.themeSaverService.getTheme();
    const alertsAndToastsTheme: Theme = theme === Theme.Light ? Theme.Dark : Theme.Light;

    this.themeWrapperService.setTheme(theme);
    this.alertsService.setTheme(alertsAndToastsTheme);
    this.toastsService.setTheme(alertsAndToastsTheme);
  }

  private saveThemeWhenItChanged(): Subscription {
    return this.themeWrapperService.theme$.subscribe((theme: Theme) => {
      this.themeSaverService.setTheme(theme);
    });
  }
}

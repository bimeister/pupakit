import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeSaverService } from '../../services/theme-saver.service';
import { Theme } from '../../../../../src/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '../../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';

@Directive({
  selector: '[demoThemeController]'
})
export class ThemeControllerDirective implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly themeWrapperService: ThemeWrapperService,
    private readonly themeSaverService: ThemeSaverService
  ) {
    this.setSavedTheme();

    this.subscription.add(this.saveThemeWhenItChanged());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setSavedTheme(): void {
    this.themeWrapperService.setTheme(this.themeSaverService.getTheme());
  }

  private saveThemeWhenItChanged(): Subscription {
    return this.themeWrapperService.theme$.subscribe((theme: Theme) => {
      this.themeSaverService.setTheme(theme);
    });
  }
}

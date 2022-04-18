import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { ToastsService } from '@kit/internal/shared/services/toasts.service';

@Component({
  selector: 'demo-change-theme-example',
  templateUrl: './change-theme-example.component.html',
  styleUrls: ['./change-theme-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ChangeThemeExampleComponent {
  private theme: Theme = Theme.Light;

  constructor(private readonly toastsService: ToastsService) {}

  public toggleTheme(): void {
    const newTheme: Theme = this.theme === Theme.Light ? Theme.Dark : Theme.Light;
    this.theme = newTheme;

    this.toastsService.setTheme(this.theme);
  }
}

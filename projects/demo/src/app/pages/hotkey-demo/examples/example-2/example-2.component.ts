import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Theme, ThemeService } from '@bimeister/pupakit.common';
import { Observable } from 'rxjs';

@Component({
  selector: 'demo-hotkey-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeyExample2Component {
  public readonly theme: typeof Theme = Theme;
  public readonly reversedTheme$: Observable<Theme> = this.themeService.reversedTheme$;

  constructor(private readonly themeService: ThemeService) {}
}

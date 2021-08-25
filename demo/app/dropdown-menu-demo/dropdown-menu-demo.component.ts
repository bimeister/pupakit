import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Theme } from '../../../src/internal/declarations/enums/theme.enum';

@Component({
  selector: 'demo-dropdown-menu',
  styleUrls: ['../demo.scss', './dropdown-menu-demo.component.scss'],
  templateUrl: './dropdown-menu-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuDemoComponent {
  public readonly theme: typeof Theme = Theme;
  public readonly themeControl: FormControl = new FormControl(Theme.Light);
  public readonly triggerText: FormControl = new FormControl('Show dropdown');
  public readonly horizontalPosition: FormControl = new FormControl('center');
}

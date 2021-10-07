import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Theme } from '../../../../src/internal/declarations/enums/theme.enum';
import { ThemeWrapperService } from '../../../../src/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';
import { RadioOption } from '../../shared/components/example-viewer/radio-option';

@Component({
  selector: 'demo-dropdown-menu',
  styleUrls: ['../demo.scss', './dropdown-menu-demo.component.scss'],
  templateUrl: './dropdown-menu-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuDemoComponent {
  public readonly theme: typeof Theme = Theme;
  public readonly triggerText: FormControl = new FormControl('Show dropdown');

  public readonly horizontalPositionOptions: RadioOption[] = [
    {
      caption: 'start',
      value: 'start'
    },
    {
      caption: 'center',
      value: 'center'
    },
    {
      caption: 'end',
      value: 'end'
    }
  ];

  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(private readonly themeWrapperService: ThemeWrapperService) {}
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'dropdown-menu-demo/examples';

@Component({
  selector: 'demo-dropdown-menu',
  styleUrls: ['../demo.scss', './dropdown-menu-demo.component.scss'],
  templateUrl: './dropdown-menu-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuDemoComponent {
  public readonly theme: typeof Theme = Theme;
  public readonly triggerText: FormControl = new FormControl('Show dropdown');

  public readonly horizontalPositionOptions: PropsOption[] = [
    {
      caption: 'start',
      value: 'start',
    },
    {
      caption: 'center',
      value: 'center',
    },
    {
      caption: 'end',
      value: 'end',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/demo-dropdown-menu-example-1/demo-dropdown-menu-example-1.component.html`,
  };
}

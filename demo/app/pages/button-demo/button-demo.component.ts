import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

@Component({
  selector: 'demo-button',
  templateUrl: './button-demo.component.html',
  styleUrls: ['./button-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonDemoComponent {
  public readonly buttonIconFormControl: FormControl = new FormControl('app-notification');

  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true,
    },
    {
      caption: 'Small',
      value: 'small',
    },
  ];

  public readonly kindOptions: PropsOption[] = [
    {
      caption: 'Primary',
      value: 'primary',
    },
    {
      caption: 'Secondary',
      value: 'secondary',
    },
    {
      caption: 'Warning',
      value: 'warning',
    },
    {
      caption: 'Danger',
      value: 'danger',
    },
    {
      caption: 'Subtle',
      value: 'subtle',
    },
    {
      caption: 'Border',
      value: 'border',
    },
    {
      caption: 'Border Contrast',
      value: 'border-contrast',
    },
    {
      caption: 'Subtle-danger',
      value: 'subtle-danger',
    },
  ];

  public readonly iconPositionOptions: PropsOption[] = [
    {
      caption: 'Unset',
      value: null,
    },
    {
      caption: 'Left',
      value: 'left',
    },
    {
      caption: 'Right',
      value: 'right',
    },
  ];
}

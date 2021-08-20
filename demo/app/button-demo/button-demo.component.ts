import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RadioOption } from '../example-viewer/radio-option';

@Component({
  selector: 'demo-button',
  templateUrl: './button-demo.component.html',
  styleUrls: ['./button-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonDemoComponent {
  public readonly sizeOptions: RadioOption[] = [
    {
      caption: 'Large',
      value: 'large'
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true
    },
    {
      caption: 'Small',
      value: 'small'
    }
  ];

  public readonly kindOptions: RadioOption[] = [
    {
      caption: 'Primary',
      value: 'primary'
    },
    {
      caption: 'Secondary',
      value: 'secondary'
    },
    {
      caption: 'Warning',
      value: 'warning'
    },
    {
      caption: 'Danger',
      value: 'danger'
    },
    {
      caption: 'Subtle',
      value: 'subtle'
    },
    {
      caption: 'Border',
      value: 'border'
    }
  ];

  public readonly iconPositionOptions: RadioOption[] = [
    {
      caption: 'Unset',
      value: null
    },
    {
      caption: 'Left',
      value: 'left'
    },
    {
      caption: 'Right',
      value: 'right'
    }
  ];
}

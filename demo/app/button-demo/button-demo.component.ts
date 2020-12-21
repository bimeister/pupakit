import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioOption } from '../example-viewer/radio-option';

@Component({
  selector: 'demo-button',
  templateUrl: './button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
      caption: 'Solid',
      value: 'solid'
    },
    {
      caption: 'Outlined',
      value: 'outlined'
    },
    {
      caption: 'Link',
      value: 'link'
    }
  ];

  public readonly colorOptions: RadioOption[] = [
    {
      caption: 'Normal',
      value: 'normal'
    },
    {
      caption: 'Normal light',
      value: 'normal-light'
    },
    {
      caption: 'Negative',
      value: 'negative'
    },
    {
      caption: 'Positive',
      value: 'positive'
    },
    {
      caption: 'Alert',
      value: 'alert'
    }
  ];

  public readonly iconOptions: RadioOption[] = [
    {
      caption: 'Unset',
      value: null
    },
    {
      caption: 'Left',
      value: {
        name: 'add-circle',
        position: 'left'
      }
    },
    {
      caption: 'Right',
      value: {
        name: 'add-circle',
        position: 'right'
      }
    }
  ];
}

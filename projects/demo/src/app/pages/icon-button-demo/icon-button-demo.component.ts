import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

@Component({
  selector: 'demo-icon-button-demo',
  templateUrl: './icon-button-demo.component.html',
  styleUrls: ['./icon-button-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonDemoComponent {
  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Medium',
      value: 'medium',
    },
    {
      caption: 'Small to medium',
      value: 'small-to-medium',
    },
    {
      caption: 'Small',
      value: 'small',
    },
  ];

  public readonly colorOptions: PropsOption[] = [
    {
      caption: 'Dark',
      value: 'dark',
    },
    {
      caption: 'Light',
      value: 'light',
    },
    {
      caption: 'Light blue',
      value: 'light-blue',
    },
    {
      caption: 'Transparent',
      value: 'transparent',
    },
  ];
}

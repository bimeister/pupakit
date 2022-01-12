import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const CODE_EXAMPLE: string = `
<pupa-avatar
  username='Ivan Ivanov'
  src='url/to/image'
  size='small'
  [withBorder]='true'>
</pupa-avatar>
`;

@Component({
  selector: 'demo-avatar-demo',
  templateUrl: './avatar-demo.component.html',
  styleUrls: ['./avatar-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarDemoComponent {
  public readonly usernameControl: FormControl = new FormControl('');
  public readonly imageSrcControl: FormControl = new FormControl('');
  public readonly codeExample: string = CODE_EXAMPLE;

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
      caption: 'Small',
      value: 'small',
      isDefault: true,
    },
  ];
}

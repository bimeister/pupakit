import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RadioOption } from '../example-viewer/radio-option';

const AVATAR_URL: string =
  'https://avatars.mds.yandex.net/get-kinopoisk-post-img/1101693/0e12fdc5deb15a5025894d214340f9aa/960x540';

@Component({
  selector: 'demo-avatar-demo',
  templateUrl: './avatar-demo.component.html',
  styleUrls: ['./avatar-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarDemoComponent {
  public readonly usernameControl: FormControl = new FormControl('');
  public readonly imageSrcControl: FormControl = new FormControl('');

  public readonly sizeOptions: RadioOption[] = [
    {
      caption: 'Medium',
      value: 'medium'
    },
    {
      caption: 'Small',
      value: 'small',
      isDefault: true
    }
  ];

  public setAvatar(): void {
    this.imageSrcControl.setValue(AVATAR_URL);
  }

  public clearUsernameInput(): void {
    this.usernameControl.reset('');
  }

  public clearImageSrcInput(): void {
    this.imageSrcControl.reset('');
  }
}

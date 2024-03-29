import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'avatar-demo/examples';

@Component({
  selector: 'demo-avatar-demo',
  templateUrl: './avatar-demo.component.html',
  styleUrls: ['./avatar-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarDemoComponent {
  public readonly avatarForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    iconName: new FormControl(''),
    src: new FormControl(''),
    backgroundSeed: new FormControl(''),
  });

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

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
  };

  public readonly example5Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-5/example-5.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-5/example-5.component.scss`,
  };

  public readonly example6Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-6/example-6.component.html`,
  };

  public readonly example7Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-7/example-7.component.html`,
  };

  public readonly exampleBackgroundSeedContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/demo-avatar-background-seed-example/demo-avatar-background-seed-example.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/demo-avatar-background-seed-example/demo-avatar-background-seed-example.component.scss`,
    TS: `${BASE_REQUEST_PATH}/demo-avatar-background-seed-example/demo-avatar-background-seed-example.component.ts`,
  };
}

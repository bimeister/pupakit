import { Component } from '@angular/core';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { Observable } from 'rxjs';
import { Theme, ThemeService } from '@bimeister/pupakit.common';

const BASE_REQUEST_PATH: string = 'toasts-demo/examples';

@Component({
  selector: 'demo-toasts-demo',
  templateUrl: './toasts-demo.component.html',
  styleUrls: ['./toasts-demo.component.scss'],
})
export class ToastsDemoComponent {
  public readonly reversedTheme$: Observable<Theme> = this.themeService.reversedTheme$;

  public readonly basicExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/basic-example/basic-example.component.html`,
    TS: `${BASE_REQUEST_PATH}/basic-example/basic-example.component.ts`,
  };

  public readonly basicAdditionalSettingsExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/basic-additional-settings-example/basic-additional-settings-example.component.html`,
    TS: `${BASE_REQUEST_PATH}/basic-additional-settings-example/basic-additional-settings-example.component.ts`,
  };

  public readonly templateRenderingExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/template-rendering-example/template-rendering-example.component.html`,
    TS: `${BASE_REQUEST_PATH}/template-rendering-example/template-rendering-example.component.ts`,
  };

  public readonly changeThemeExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/change-theme-example/change-theme-example.component.html`,
    TS: `${BASE_REQUEST_PATH}/change-theme-example/change-theme-example.component.ts`,
  };

  public readonly typeOptions: PropsOption[] = [
    {
      caption: 'Info',
      value: 'info',
    },
    {
      caption: 'Success',
      value: 'success',
    },
    {
      caption: 'Warning',
      value: 'warning',
    },
    {
      caption: 'Danger',
      value: 'danger',
    },
  ];

  constructor(private readonly themeService: ThemeService) {}
}

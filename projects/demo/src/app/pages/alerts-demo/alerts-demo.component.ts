import { Component } from '@angular/core';

const BASE_REQUEST_PATH: string = 'alerts-demo/examples';
@Component({
  selector: 'demo-alerts-demo',
  templateUrl: './alerts-demo.component.html',
  styleUrls: ['./alerts-demo.component.scss'],
})
export class AlertsDemoComponent {
  public readonly alertsToolbarExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/alerts-toolbar-example/alerts-toolbar-example.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/alerts-toolbar-example/alerts-toolbar-example.component.scss`,
    TS: `${BASE_REQUEST_PATH}/alerts-toolbar-example/alerts-toolbar-example.component.ts`,
  };

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
}

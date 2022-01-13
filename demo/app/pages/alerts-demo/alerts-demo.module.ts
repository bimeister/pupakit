import { NgModule } from '@angular/core';

import { DemoSharedModule } from '../../shared/shared.module';
import { AlertsDemoRoutingModule } from './alerts-demo-routing.module';
import { AlertsDemoComponent } from './alerts-demo.component';
import { AlertsToolbarExampleComponent } from './examples/alerts-toolbar-example/alerts-toolbar-example.component';
import { BasicAdditionalSettingsExampleComponent } from './examples/basic-additional-settings-example/basic-additional-settings-example.component';
import { BasicExampleComponent } from './examples/basic-example/basic-example.component';
import { TemplateRenderingExampleComponent } from './examples/template-rendering-example/template-rendering-example.component';
import { ChangeThemeExampleComponent } from './examples/change-theme-example/change-theme-example.component';

@NgModule({
  declarations: [
    AlertsDemoComponent,
    BasicExampleComponent,
    BasicAdditionalSettingsExampleComponent,
    AlertsToolbarExampleComponent,
    TemplateRenderingExampleComponent,
    ChangeThemeExampleComponent,
  ],
  imports: [DemoSharedModule, AlertsDemoRoutingModule],
})
export class AlertsDemoModule {}

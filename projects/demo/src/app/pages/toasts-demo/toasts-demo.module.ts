import { NgModule } from '@angular/core';

import { DemoSharedModule } from '../../shared/shared.module';
import { BasicExampleComponent } from './examples/basic-example/basic-example.component';
import { TemplateRenderingExampleComponent } from './examples/template-rendering-example/template-rendering-example.component';
import { ToastsDemoRoutingModule } from './toasts-demo-routing.module';
import { ToastsDemoComponent } from './toasts-demo.component';

@NgModule({
  declarations: [ToastsDemoComponent, BasicExampleComponent, TemplateRenderingExampleComponent],
  imports: [DemoSharedModule, ToastsDemoRoutingModule],
})
export class ToastsDemoModule {}

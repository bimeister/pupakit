import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { FormLayoutDemoRoutingModule } from './form-layout-demo-routing.module';
import { FormLayoutDemoComponent } from './form-layout-demo.component';
import { BaseExampleComponent } from './examples/base-example/base-example.component';

@NgModule({
  declarations: [FormLayoutDemoComponent, BaseExampleComponent],
  imports: [DemoSharedModule, FormLayoutDemoRoutingModule],
})
export class FormLayoutDemoModule {}

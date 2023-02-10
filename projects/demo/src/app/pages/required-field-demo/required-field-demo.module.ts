import { NgModule } from '@angular/core';
import { DemoSharedModule } from 'src/app/shared/shared.module';
import { RequiredFieldExample1Component } from './examples/example-1/example-1.component';
import { RequiredFieldDemoRoutingModule } from './required-field-demo-routing.module';
import { RequiredFieldDemoComponent } from './required-field-demo.component';

@NgModule({
  declarations: [RequiredFieldDemoComponent, RequiredFieldExample1Component],
  imports: [DemoSharedModule, RequiredFieldDemoRoutingModule],
})
export class RequiredFieldDemoModule {}

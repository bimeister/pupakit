import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DropdownRoutingModule } from './dropdown-demo-routing.module';
import { DropdownDemoComponent } from './dropdown-demo.component';
import { DropdownDemoExample1Component } from './examples/dropdown-demo-example-1/dropdown-demo-example-1.component';

@NgModule({
  declarations: [DropdownDemoExample1Component, DropdownDemoComponent],
  imports: [DemoSharedModule, DropdownRoutingModule],
})
export class DropdownDemoModule {}

import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DropdownDemoRoutingModule } from './dropdown-demo-routing.module';
import { DropdownDemoComponent } from './dropdown-demo.component';

@NgModule({
  declarations: [DropdownDemoComponent],
  imports: [DemoSharedModule, DropdownDemoRoutingModule]
})
export class DropdownDemoModule {}

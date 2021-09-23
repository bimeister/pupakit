import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DropdownMenuDemoRoutingModule } from './dropdown-menu-demo-routing.module';
import { DropdownMenuDemoComponent } from './dropdown-menu-demo.component';

@NgModule({
  declarations: [DropdownMenuDemoComponent],
  imports: [DemoSharedModule, DropdownMenuDemoRoutingModule]
})
export class DropdownMenuDemoModule {}

import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DropdownMenuDemoRoutingModule } from './dropdown-menu-demo-routing.module';
import { DropdownMenuDemoComponent } from './dropdown-menu-demo.component';
import { DropdownMenuExample1Component } from './examples/demo-dropdown-menu-example-1/demo-dropdown-menu-example-1.component';

const EXAMPLES: Type<unknown>[] = [DropdownMenuExample1Component];
const COMPONENTS: Type<unknown>[] = [DropdownMenuDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: DECLARATIONS,
  imports: [DemoSharedModule, DropdownMenuDemoRoutingModule],
})
export class DropdownMenuDemoModule {}

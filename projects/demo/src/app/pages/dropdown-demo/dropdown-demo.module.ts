import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DropdownRoutingModule } from './dropdown-demo-routing.module';
import { DropdownDemoComponent } from './dropdown-demo.component';
import { DropdownDemoExample1Component } from './examples/dropdown-demo-example-1/dropdown-demo-example-1.component';
import { DropdownDemoExample2Component } from './examples/dropdown-demo-example-2/dropdown-demo-example-2.component';
import { DropdownDemoExample3Component } from './examples/dropdown-demo-example-3/dropdown-demo-example-3.component';
import { DropdownDemoContainerComponent } from './examples/dropdown-demo-container/dropdown-demo-container.component';

@NgModule({
  declarations: [
    DropdownDemoExample1Component,
    DropdownDemoExample2Component,
    DropdownDemoExample3Component,
    DropdownDemoContainerComponent,
    DropdownDemoComponent,
  ],
  imports: [DemoSharedModule, DropdownRoutingModule],
})
export class DropdownDemoModule {}

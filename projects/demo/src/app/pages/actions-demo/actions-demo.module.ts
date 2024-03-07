import { NgModule } from '@angular/core';

import { DemoSharedModule } from '../../shared/shared.module';
import { ActionsDemoRoutingModule } from './actions-demo-routing.module';
import { ActionsDemoComponent } from './actions-demo.component';

import { ActionsExample1Component } from './examples/example-1/example-1.component';
import { ActionsExample2Component } from './examples/example-2/example-2.component';
import { ActionsExample3Component } from './examples/example-3/example-3.component';
import { ActionsExample4Component } from './examples/example-4/example-4.component';
import { ActionsExample5Component } from './examples/example-5/example-5.component';
import { PopoverLayoutComponent } from './examples/example-5/popover-layout-basic/popover-layout.component';
import { ActionsExample6Component } from './examples/example-6/example-6.component';
import { ActionsExample7Component } from './examples/example-7/example-7.component';
import { ActionsExample8Component } from './examples/example-8/example-8.component';

@NgModule({
  declarations: [
    ActionsDemoComponent,
    ActionsExample1Component,
    ActionsExample2Component,
    ActionsExample3Component,
    ActionsExample4Component,
    ActionsExample5Component,
    ActionsExample6Component,
    ActionsExample7Component,
    ActionsExample8Component,
    PopoverLayoutComponent,
  ],
  imports: [DemoSharedModule, ActionsDemoRoutingModule],
})
export class ActionsDemoModule {}

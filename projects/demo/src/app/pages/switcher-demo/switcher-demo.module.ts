import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SwitcherExample1Component } from './examples/example-1/example-1.component';
import { SwitcherExample2Component } from './examples/example-2/example-2.component';
import { SwitcherDemoRoutingModule } from './switcher-demo-routing.module';
import { SwitcherDemoComponent } from './switcher-demo.component';

const EXAMPLES: Type<unknown>[] = [SwitcherExample1Component, SwitcherExample2Component];
const COMPONENTS: Type<unknown>[] = [SwitcherDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, SwitcherDemoRoutingModule],
})
export class SwitcherDemoModule {}

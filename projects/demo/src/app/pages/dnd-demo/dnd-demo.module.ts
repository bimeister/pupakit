import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { DndDemoComponent } from './dnd-demo.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { DndDemoRoutingModule } from './dnd-demo-routing.module';
import { Example1Component } from './examples/example-1/example-1.component';
import { Example2Component } from './examples/example-2/example-2.component';

@NgModule({
  imports: [LayoutModule, DemoSharedModule, DndDemoRoutingModule],
  declarations: [DndDemoComponent, Example1Component, Example2Component],
})
export class DndDemoModule {}

import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { HighlightDemoRoutingModule } from './highlight-demo-routing.module';
import { HighlightDemoComponent } from './highlight-demo.component';
import { Example1Component } from './examples/example-1/example-1.component';

@NgModule({
  declarations: [HighlightDemoComponent, Example1Component],
  imports: [DemoSharedModule, HighlightDemoRoutingModule],
})
export class HighlightDemoModule {}

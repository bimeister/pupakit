import { NgModule } from '@angular/core';
import { ScrollableDemoComponent } from './scrollable-demo.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { ScrollableDemoRoutingModule } from './scrollable-demo-routing.module';
import { ScrollableExample1Component } from './examples/example-1/example-1.component';
import { ScrollableExample2Component } from './examples/example-2/example-2.component';
import { ScrollableExample3Component } from './examples/example-3/example-3.component';

@NgModule({
  declarations: [
    ScrollableDemoComponent,
    ScrollableExample1Component,
    ScrollableExample2Component,
    ScrollableExample3Component,
  ],
  imports: [DemoSharedModule, ScrollableDemoRoutingModule],
})
export class ScrollableDemoModule {}

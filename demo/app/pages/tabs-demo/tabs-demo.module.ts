import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TabsDemoRoutingModule } from './tabs-demo-routing.module';
import { TabsDemoComponent } from './tabs-demo.component';
import { TabsExample1Component } from './examples/example-1/example-1.component';
import { TabsExample2Component } from './examples/example-2/example-2.component';
import { TabsExample3Component } from './examples/example-3/example-3.component';
import { TabsExample4Component } from './examples/example-4/example-4.component';
import { TabsExample5Component } from './examples/example-5/example-5.component';
import { TabsExample6Component } from './examples/example-6/example-6.component';
import { TabsExample7Component } from './examples/example-7/example-7.component';

@NgModule({
  declarations: [
    TabsDemoComponent,
    TabsExample1Component,
    TabsExample2Component,
    TabsExample3Component,
    TabsExample4Component,
    TabsExample5Component,
    TabsExample6Component,
    TabsExample7Component,
  ],
  imports: [DemoSharedModule, TabsDemoRoutingModule],
})
export class TabsDemoModule {}

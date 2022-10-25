import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DaySelectorDemoRoutingModule } from './day-selector-demo-routing.module';
import { DaySelectorDemoComponent } from './day-selector-demo.component';
import { DemoPlainDaySelectorExampleComponent } from './examples/demo-plain-day-selector-example/demo-plain-day-selector-example.component';
import { DemoItemSizeDaySelectorExampleComponent } from './examples/demo-item-size-day-selector-example/demo-item-size-day-selector-example.component';
import { DemoLocaleDaySelectorExampleComponent } from './examples/demo-locale-day-selector-example/demo-locale-day-selector-example.component';

@NgModule({
  declarations: [
    DaySelectorDemoComponent,
    DemoPlainDaySelectorExampleComponent,
    DemoItemSizeDaySelectorExampleComponent,
    DemoLocaleDaySelectorExampleComponent,
  ],
  imports: [DemoSharedModule, DaySelectorDemoRoutingModule],
})
export class DaySelectorDemoModule {}

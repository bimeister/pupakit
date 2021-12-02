import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SelectDemoComponent } from './select-demo.component';
import { SelectDemoRoutingModule } from './select-demo-routing.module';

@NgModule({
  declarations: [SelectDemoComponent],
  imports: [DemoSharedModule, SelectDemoRoutingModule],
})
export class SelectDemoModule {}

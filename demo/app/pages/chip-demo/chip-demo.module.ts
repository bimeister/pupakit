import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ChipDemoRoutingModule } from './chip-demo-routing.module';
import { ChipDemoComponent } from './chip-demo.component';

@NgModule({
  declarations: [ChipDemoComponent],
  imports: [DemoSharedModule, ChipDemoRoutingModule],
})
export class ChipDemoModule {}

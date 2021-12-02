import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ChipTabsDemoRoutingModule } from './chip-tabs-demo-routing.module';
import { ChipTabsDemoComponent } from './chip-tabs-demo.component';

@NgModule({
  declarations: [ChipTabsDemoComponent],
  imports: [DemoSharedModule, ChipTabsDemoRoutingModule],
})
export class ChipTabsDemoModule {}

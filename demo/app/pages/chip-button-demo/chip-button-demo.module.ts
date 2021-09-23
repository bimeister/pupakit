import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ChipButtonDemoRoutingModule } from './chip-button-demo-routing.module';
import { ChipButtonDemoComponent } from './chip-button-demo.component';

@NgModule({
  declarations: [ChipButtonDemoComponent],
  imports: [DemoSharedModule, ChipButtonDemoRoutingModule]
})
export class ChipButtonDemoModule {}

import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DaySelectorDemoRoutingModule } from './day-selector-demo-routing.module';
import { DaySelectorDemoComponent } from './day-selector-demo.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DaySelectorDemoComponent],
  imports: [DemoSharedModule, DaySelectorDemoRoutingModule, FormsModule]
})
export class DaySelectorDemoModule {}

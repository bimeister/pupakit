import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SelectMultipleDemoRoutingModule } from './select-multiple-demo-routing.module';
import { SelectMultipleDemoComponent } from './select-multiple-demo.component';

@NgModule({
  declarations: [SelectMultipleDemoComponent],
  imports: [DemoSharedModule, SelectMultipleDemoRoutingModule]
})
export class SelectMultipleDemoModule {}

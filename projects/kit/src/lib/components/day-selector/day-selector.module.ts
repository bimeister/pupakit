import { NgModule } from '@angular/core';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';
import { DaySelectorItemComponent } from './components/day-selector-item/day-selector-item.component';
import { SharedModule } from '../../../internal/shared/shared.module';

@NgModule({
  declarations: [DaySelectorComponent, DaySelectorItemComponent],
  imports: [SharedModule],
  exports: [DaySelectorComponent],
})
export class DaySelectorModule {}

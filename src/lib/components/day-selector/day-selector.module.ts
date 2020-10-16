import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';

@NgModule({
  declarations: [DaySelectorComponent],
  imports: [SharedModule],
  exports: [DaySelectorComponent]
})
export class DaySelectorModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { CounterComponent } from './components/chip/counter.component';

@NgModule({
  declarations: [CounterComponent],
  imports: [SharedModule],
  exports: [CounterComponent]
})
export class CounterModule {}

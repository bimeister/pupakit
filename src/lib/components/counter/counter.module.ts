import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { CounterComponent } from './components/counter/counter.component';

@NgModule({
  declarations: [CounterComponent],
  imports: [SharedModule],
  exports: [CounterComponent],
})
export class CounterModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaPipesModule } from '@bimeister/pupakit.common';

import { CounterComponent } from './components/counter/counter.component';

@NgModule({
  declarations: [CounterComponent],
  imports: [CommonModule, PupaPipesModule],
  exports: [CounterComponent],
})
export class PupaCounterModule {}

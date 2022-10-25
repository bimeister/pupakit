import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { TimerRoundComponent } from './components/timer-round/timer-round.component';

const EXPORTS: Type<unknown>[] = [TimerRoundComponent];

@NgModule({
  declarations: [...EXPORTS],
  imports: [CommonModule],
  exports: EXPORTS,
})
export class PupaTimerModule {}

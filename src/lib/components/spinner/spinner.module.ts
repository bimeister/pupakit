import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { BagelSpinnerComponent } from './components/bagel-spinner/bagel-spinner.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [SpinnerComponent, BagelSpinnerComponent],
  imports: [SharedModule],
  exports: [SpinnerComponent, BagelSpinnerComponent]
})
export class SpinnerModule {}

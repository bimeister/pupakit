import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BagelSpinnerComponent } from './components/bagel-spinner/bagel-spinner.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [SpinnerComponent, BagelSpinnerComponent],
  imports: [CommonModule],
  exports: [SpinnerComponent, BagelSpinnerComponent],
})
export class PupaSpinnerModule {}

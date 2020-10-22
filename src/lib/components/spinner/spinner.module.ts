import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [SpinnerComponent],
  imports: [SharedModule],
  exports: [SpinnerComponent]
})
export class SpinnerModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [SpinnerComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SpinnerComponent]
})
export class SpinnerModule {}

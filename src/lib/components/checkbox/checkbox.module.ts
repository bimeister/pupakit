import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [CheckboxComponent]
})
export class CheckboxModule {}

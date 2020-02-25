import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ControlTextComponent } from './components/control-text/control-text.component';

@NgModule({
  declarations: [ControlTextComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ControlTextComponent]
})
export class ControlTextModule {}

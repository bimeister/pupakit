import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [ModalComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ModalComponent]
})
export class ModalModule {}

import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ModalComponent } from './components/modal/modal.component';
import { IconModule } from '../icon/icon.module';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';

@NgModule({
  declarations: [ModalComponent],
  imports: [SharedModule, IconModule.forFeature([mdCloseIcon])],
  exports: [ModalComponent]
})
export class ModalModule {}

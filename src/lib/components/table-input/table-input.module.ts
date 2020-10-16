import { NgModule } from '@angular/core';
import { SharedModule } from './../../../internal/shared/shared.module';
import { TableInputComponent } from './components/table-input/table-input.component';
import { IconModule } from '../icon/icon.module';
import { mdAlertIcon } from '../../../internal/constants/icons/md-alert-icon.const';
import { mdCreateIcon } from '../../../internal/constants/icons/md-create-icon.const';

@NgModule({
  declarations: [TableInputComponent],
  imports: [SharedModule, IconModule.forFeature([mdAlertIcon, mdCreateIcon])],
  exports: [TableInputComponent]
})
export class TableInputModule {}

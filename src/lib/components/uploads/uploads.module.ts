import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { ProgressBarModule } from '../progress-bar/progress-bar.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { UploadsButtonComponent } from './components/uploads-button/uploads-button.component';
import { UploadsItemStatusComponent } from './components/uploads-item-status/uploads-item-status.component';
import { UploadsItemComponent } from './components/uploads-item/uploads-item.component';

@NgModule({
  declarations: [UploadsItemComponent, UploadsItemStatusComponent, UploadsButtonComponent],
  imports: [SharedModule, ProgressBarModule, ButtonModule, SpinnerModule, IconModule.forFeature()],
  exports: [UploadsItemComponent, UploadsItemStatusComponent, UploadsButtonComponent]
})
export class UploadsModule {}

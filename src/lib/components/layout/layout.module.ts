import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { AlertComponent } from './components/alert/alert.component';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { IconModule } from '../icon/icon.module';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  imports: [SharedModule, IconModule.forFeature([mdCloseIcon]), SpinnerModule],
  declarations: [AlertComponent, CloseButtonComponent, LayoutComponent, LoaderComponent, OverlayComponent],
  exports: [LayoutComponent, LoaderComponent],
})
export class LayoutModule {}

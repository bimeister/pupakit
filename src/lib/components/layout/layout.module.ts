import { NgModule } from '@angular/core';

import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoaderComponent } from './components/loader/loader.component';
import { OverlayComponent } from './components/overlay/overlay.component';

@NgModule({
  imports: [SharedModule, IconModule.forFeature([mdCloseIcon]), SpinnerModule],
  declarations: [CloseButtonComponent, LayoutComponent, LoaderComponent, OverlayComponent],
  exports: [LayoutComponent, LoaderComponent],
})
export class LayoutModule {}

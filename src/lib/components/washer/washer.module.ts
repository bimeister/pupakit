import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { IconButtonModule } from './../icon-button/icon-button.module';
import { WasherComponent } from './components/washer/washer.component';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [WasherComponent],
  imports: [SharedModule, IconButtonModule, IconModule.forFeature()],
  exports: [WasherComponent]
})
export class WasherModule {}

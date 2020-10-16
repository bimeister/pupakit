import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  declarations: [ButtonComponent],
  imports: [SharedModule, SpinnerModule, IconModule.forFeature()],
  exports: [ButtonComponent]
})
export class ButtonModule {}

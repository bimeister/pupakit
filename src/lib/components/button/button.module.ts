import { NgModule, Type } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { ButtonIconComponent } from './components/button-icon/button-icon.component';

const COMPONENTS: Type<unknown>[] = [ButtonComponent, ButtonIconComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, SpinnerModule, IconModule.forFeature()],
  exports: [...EXPORTS]
})
export class ButtonModule {}

import { NgModule, Type } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { ButtonRoundComponent } from './components/button-round/button-round.component';
import { ButtonMultiComponent } from './components/button-multi/button-multi.component';
import { OverlayModule } from '@angular/cdk/overlay';

const COMPONENTS: Type<unknown>[] = [ButtonComponent, ButtonIconComponent, ButtonRoundComponent, ButtonMultiComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, SpinnerModule, IconModule.forFeature(), OverlayModule],
  exports: [...EXPORTS]
})
export class ButtonModule {}

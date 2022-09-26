import { NgModule, Type } from '@angular/core';
import { ButtonComponent } from './components/button/button.component';
import { SharedModule } from '../../../internal/shared/shared.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { IconModule } from '../icon/icon.module';
import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { ButtonRoundComponent } from './components/button-round/button-round.component';
import { ButtonMultiComponent } from './components/button-multi/button-multi.component';
import { DropdownModule } from '../dropdown/dropdown.module';

const COMPONENTS: Type<unknown>[] = [ButtonComponent, ButtonIconComponent, ButtonRoundComponent, ButtonMultiComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, SpinnerModule, IconModule.forFeature(), DropdownModule],
  exports: [...EXPORTS],
})
export class ButtonsModule {}

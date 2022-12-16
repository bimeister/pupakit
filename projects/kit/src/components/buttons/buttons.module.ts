import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaDropdownModule } from '../dropdown/dropdown.module';
import { PupaSpinnerModule } from '../spinner/spinner.module';
import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { ButtonMultiComponent } from './components/button-multi/button-multi.component';
import { ButtonRoundComponent } from './components/button-round/button-round.component';
import { ButtonComponent } from './components/button/button.component';

const COMPONENTS: Type<unknown>[] = [ButtonComponent, ButtonIconComponent, ButtonRoundComponent, ButtonMultiComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, PupaSpinnerModule, PupaIconsModule.forFeature(), PupaDropdownModule],
  exports: [...EXPORTS],
})
export class PupaButtonsModule {}

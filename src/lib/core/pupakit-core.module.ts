import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { InputComponent } from './components/input/input.component';
import { LabelComponent } from './components/label/label.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

const CORE_COMPONENTS: any[] = [ButtonComponent, InputComponent, CheckboxComponent, SpinnerComponent, LabelComponent];

@NgModule({
  imports: [SharedModule],
  declarations: [...CORE_COMPONENTS],
  exports: [SharedModule, ...CORE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PupakitCore {}

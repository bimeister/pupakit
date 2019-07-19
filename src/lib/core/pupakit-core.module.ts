import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ControlTextComponent } from './components/control-text/control-text.component';
import { InputComponent } from './components/input/input.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TileComponent } from './components/tile/tile.component';

const CORE_COMPONENTS: any[] = [
  ButtonComponent,
  InputComponent,
  CheckboxComponent,
  SpinnerComponent,
  ControlTextComponent,
  LoaderComponent,
  TileComponent
];

@NgModule({
  imports: [SharedModule],
  declarations: [...CORE_COMPONENTS],
  exports: [SharedModule, ...CORE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PupakitCore {}

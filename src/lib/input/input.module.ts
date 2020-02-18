import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ChipSelectModule } from '../chip-select';
import { AngularComponent, SharedModule } from './../../internal';
import { InputComponent } from './components/input';

const COMPONENTS: AngularComponent[] = [InputComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, ChipSelectModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class InputModule {}

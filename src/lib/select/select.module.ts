import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { DropdownModule } from '../dropdown';
import { AngularComponent, SharedModule } from './../../internal';
import { SelectComponent } from './components';

const COMPONENTS: AngularComponent[] = [SelectComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, DropdownModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class SelectModule {}

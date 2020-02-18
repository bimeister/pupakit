import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from './../../internal';
import { DropdownComponent, DropdownItemComponent } from './components';

const COMPONENTS: AngularComponent[] = [DropdownComponent, DropdownItemComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class DropdownModule {}

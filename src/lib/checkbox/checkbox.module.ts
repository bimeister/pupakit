import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from './../../internal';
import { CheckboxComponent } from './components';

const COMPONENTS: AngularComponent[] = [CheckboxComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class CheckboxModule {}

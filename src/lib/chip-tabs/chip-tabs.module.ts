import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from './../../internal';
import { ChipTabsComponent, ChipTabsItemComponent } from './components';

const COMPONENTS: AngularComponent[] = [ChipTabsComponent, ChipTabsItemComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class ChipTabsModule {}

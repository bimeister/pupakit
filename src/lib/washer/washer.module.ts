import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IconButtonModule } from '../icon-button';
import { AngularComponent, SharedModule } from './../../internal';
import { WasherComponent } from './components/washer';

const COMPONENTS: AngularComponent[] = [WasherComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, IconButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class WasherModule {}

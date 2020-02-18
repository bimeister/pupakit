import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from './../../internal';
import { RatingComponent } from './components';

const COMPONENTS: AngularComponent[] = [RatingComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class RatingModule {}

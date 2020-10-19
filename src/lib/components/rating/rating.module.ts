import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { RatingComponent } from './components/rating/rating.component';

@NgModule({
  declarations: [RatingComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RatingComponent]
})
export class RatingModule {}

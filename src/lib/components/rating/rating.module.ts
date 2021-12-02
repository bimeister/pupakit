import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { RatingComponent } from './components/rating/rating.component';
import { IconModule } from '../icon/icon.module';
import { mdStarIcon } from '../../../internal/constants/icons/md-star-icon.const';
import { mdStarOutlineIcon } from '../../../internal/constants/icons/md-star-outline-icon.const';

@NgModule({
  declarations: [RatingComponent],
  imports: [SharedModule, IconModule.forFeature([mdStarIcon, mdStarOutlineIcon])],
  exports: [RatingComponent],
})
export class RatingModule {}

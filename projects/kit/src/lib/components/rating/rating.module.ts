import { NgModule } from '@angular/core';
import { mdStarIcon } from '../../../internal/constants/icons/md-star-icon.const';
import { mdStarOutlineIcon } from '../../../internal/constants/icons/md-star-outline-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { RatingComponent } from './components/rating/rating.component';

@NgModule({
  declarations: [RatingComponent],
  imports: [SharedModule, IconModule.forFeature([mdStarIcon, mdStarOutlineIcon])],
  exports: [RatingComponent],
})
export class RatingModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaIconsModule, mdStarIcon, mdStarOutlineIcon } from '@bimeister/pupakit.icons';
import { RatingComponent } from './components/rating/rating.component';

@NgModule({
  declarations: [RatingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaIconsModule.forFeature([mdStarIcon, mdStarOutlineIcon]),
  ],
  exports: [RatingComponent],
})
export class PupaRatingModule {}

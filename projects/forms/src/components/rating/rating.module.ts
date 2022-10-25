import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaIconsModule, mdStarIcon, mdStarOutlineIcon } from '@bimeister/pupakit.icons';
import { PupaIconModule } from '@bimeister/pupakit.kit';
import { RatingComponent } from './components/rating/rating.component';

@NgModule({
  declarations: [RatingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaIconModule,
    PupaIconsModule.forFeature([mdStarIcon, mdStarOutlineIcon]),
  ],
  exports: [RatingComponent],
})
export class PupaRatingModule {}

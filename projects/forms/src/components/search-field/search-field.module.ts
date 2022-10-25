import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { appCrossCircleIcon, appSearchIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule, PupaIconModule } from '@bimeister/pupakit.kit';
import { SearchFieldComponent } from './components/search-field/search-field.component';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaButtonsModule,
    PupaIconModule,
    PupaIconsModule.forFeature([appCrossCircleIcon, appSearchIcon]),
  ],
  exports: [SearchFieldComponent],
})
export class PupaSearchFieldModule {}

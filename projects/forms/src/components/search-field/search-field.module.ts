import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';
import { PupaIconsModule, appCrossCircleIcon, appSearchIcon } from '@bimeister/pupakit.icons';
import { PupaButtonsModule } from '@bimeister/pupakit.kit';
import { SearchFieldComponent } from './components/search-field/search-field.component';

@NgModule({
  declarations: [SearchFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaButtonsModule,
    PupaIconsModule.forFeature([appCrossCircleIcon, appSearchIcon]),
    PupaDirectivesModule,
  ],
  exports: [SearchFieldComponent],
})
export class PupaSearchFieldModule {}

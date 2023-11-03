import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';
import { appCloseSquareIcon, appSearchIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule } from '@bimeister/pupakit.kit';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SearchFieldActionsRightDirective } from './directives/search-field-actions-right.directive';

@NgModule({
  declarations: [SearchFieldComponent, SearchFieldActionsRightDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaButtonsModule,
    PupaIconsModule.forFeature([appCloseSquareIcon, appSearchIcon]),
    PupaDirectivesModule,
  ],
  exports: [SearchFieldComponent, SearchFieldActionsRightDirective],
})
export class PupaSearchFieldModule {}

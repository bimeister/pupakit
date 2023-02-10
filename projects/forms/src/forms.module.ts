import { NgModule, Type } from '@angular/core';
import { PupaControlTextModule } from './components/control-text/control-text.module';
import { PupaDateTimePickerModule } from './components/date-time-picker/date-time-picker.module';
import { PupaDaySelectorModule } from './components/day-selector/day-selector.module';
import { PupaDroppableModule } from './components/droppable/droppable.module';
import { PupaFormLayoutModule } from './components/form-layout/form-layout.module';
import { PupaInputModule } from './components/input/input.module';
import { PupaLabelModule } from './components/label/label.module';
import { PupaRadioGroupModule } from './components/radio-group/radio-group.module';
import { PupaRatingModule } from './components/rating/rating.module';
import { PupaRequiredFieldModule } from './components/required-field/required-field.module';
import { PupaSearchFieldModule } from './components/search-field/search-field.module';
import { PupaSelectModule } from './components/select/select.module';
import { PupaSwitcherModule } from './components/switcher/switcher.module';
import { PupaTextareaModule } from './components/textarea/textarea.module';

const MODULES: Type<unknown>[] = [
  PupaInputModule,
  PupaSelectModule,
  PupaTextareaModule,
  PupaRadioGroupModule,
  PupaDroppableModule,
  PupaDateTimePickerModule,
  PupaDaySelectorModule,
  PupaSearchFieldModule,
  PupaControlTextModule,
  PupaFormLayoutModule,
  PupaSwitcherModule,
  PupaRatingModule,
  PupaRequiredFieldModule,
  PupaLabelModule,
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class PupaFormsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import {
  appCalendarIcon,
  appClockIcon,
  appCloseSquareIcon,
  appErrorFilledIcon,
  appEyeClosedIcon,
  appEyeOpenIcon,
  PupaIconsModule,
} from '@bimeister/pupakit.icons';
import { PupaButtonsModule, PupaIconHolderModule, PupaLoaderModule, PupaTooltipModule } from '@bimeister/pupakit.kit';
import { MaskitoDirective } from '@maskito/angular';
import { NgxMaskModule } from 'ngx-mask';
import { PupaDateTimePickerModule } from '../date-time-picker/date-time-picker.module';
import { PupaDroppableModule } from '../droppable/droppable.module';
import { InputDateRangeDoubleComponent } from './components/input-date-range-double/input-date-range-double.component';
import { InputDateRangeComponent } from './components/input-date-range/input-date-range.component';
import { InputDateTimeSecondsComponent } from './components/input-date-time-seconds/input-date-time-seconds.component';
import { InputDateTimeComponent } from './components/input-date-time/input-date-time.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTimeComponent } from './components/input-time/input-time.component';
import { InputActionsLeftDirective } from './directives/input-actions-left.directive';
import { InputActionsRightDirective } from './directives/input-actions-right.directive';

const EXPORTS: any[] = [
  InputTextComponent,
  InputPasswordComponent,
  InputDateComponent,
  InputNumberComponent,
  InputTimeComponent,
  InputDateTimeComponent,
  InputDateTimeSecondsComponent,
  InputDateRangeComponent,
  InputDateRangeDoubleComponent,

  InputActionsRightDirective,
  InputActionsLeftDirective,
];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaPipesModule,
    PupaDateTimePickerModule,
    PupaDroppableModule,
    PupaTooltipModule,
    PupaIconsModule.forFeature([
      appCloseSquareIcon,
      appCalendarIcon,
      appErrorFilledIcon,
      appEyeClosedIcon,
      appEyeOpenIcon,
      appClockIcon,
    ]),
    NgxMaskModule.forRoot(),
    PupaButtonsModule,
    PupaIconHolderModule,
    MaskitoDirective,
    PupaLoaderModule,
  ],
  exports: [...EXPORTS],
})
export class PupaInputModule {}

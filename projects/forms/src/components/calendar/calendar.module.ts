import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaDirectivesModule, PupaPipesModule } from '@bimeister/pupakit.common';
import { appChevronDownIcon, appChevronUpIcon, iosRadioButtonOffIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule, PupaScrollableModule } from '@bimeister/pupakit.kit';
import { PupaInputModule } from '../input/input.module';
import { PupaLabelModule } from '../label/label.module';
import { CalendarCellEmptyComponent } from './components/calendar-cell-empty/calendar-cell-empty.component';
import { CalendarCellSeparatorComponent } from './components/calendar-cell-separator/calendar-cell-separator.component';
import { CalendarCellComponent } from './components/calendar-cell/calendar-cell.component';
import { CalendarControlPanelComponent } from './components/calendar-control-panel/calendar-control-panel.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { CalendarLabelComponent } from './components/calendar-label/calendar-label.component';
import { CalendarMonthSelectorComponent } from './components/calendar-month-selector/calendar-month-selector.component';
import { CalendarMonthComponent } from './components/calendar-month/calendar-month.component';
import { CalendarScrollerComponent } from './components/calendar-scroller/calendar-scroller.component';
import { CalendarSelectorButtonComponent } from './components/calendar-selector-button/calendar-selector-button.component';
import { CalendarTimePickerComponent } from './components/calendar-time-picker/calendar-time-picker.component';
import { CalendarWeekPanelComponent } from './components/calendar-week-panel/calendar-week-panel.component';
import { CalendarWeekComponent } from './components/calendar-week/calendar-week.component';
import { CalendarYearSelectorComponent } from './components/calendar-year-selector/calendar-year-selector.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DayPositionInDateRangePipe } from './pipes/day-position-in-date-range.pipe';
import { IsCurrentCalendarMonthPipe } from './pipes/is-current-calendar-month.pipe';
import { IsDaySelectedPipe } from './pipes/is-day-selected.pipe';
import { IsEmptyDayInDateRangePipe } from './pipes/is-empty-day-in-date-range.pipe';
import { MonthDayCellsPipe } from './pipes/month-day-cells.pipe';
import { NextCalendarMonthPipe } from './pipes/next-calendar-month.pipe';

const INTERNAL_COMPONENTS: Type<unknown>[] = [
  CalendarScrollerComponent,
  CalendarDayComponent,
  CalendarLabelComponent,
  CalendarWeekPanelComponent,
  CalendarHeaderComponent,
  CalendarMonthComponent,
  CalendarControlPanelComponent,
  CalendarYearSelectorComponent,
  CalendarMonthSelectorComponent,
  CalendarWeekComponent,
  CalendarCellComponent,
  CalendarCellEmptyComponent,
  CalendarCellSeparatorComponent,
  CalendarSelectorButtonComponent,
  CalendarTimePickerComponent,
];

const INTERNAL_PIPES: Type<unknown>[] = [
  MonthDayCellsPipe,
  IsCurrentCalendarMonthPipe,
  NextCalendarMonthPipe,
  IsDaySelectedPipe,
  DayPositionInDateRangePipe,
  IsEmptyDayInDateRangePipe,
];

const EXTERNAL_COMPONENTS: Type<unknown>[] = [CalendarComponent];

@NgModule({
  declarations: [INTERNAL_COMPONENTS, EXTERNAL_COMPONENTS, INTERNAL_PIPES],
  imports: [
    CommonModule,
    PupaLabelModule,
    ReactiveFormsModule,
    FormsModule,
    PupaButtonsModule,
    PupaScrollableModule,
    PupaDirectivesModule,
    PupaPipesModule,
    PupaInputModule,
    ScrollingModule,
    PupaIconsModule.forFeature([appChevronDownIcon, appChevronUpIcon, iosRadioButtonOffIcon]),
  ],
  exports: [EXTERNAL_COMPONENTS],
})
export class PupaCalendarModule {}

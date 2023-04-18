import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarFastSelectMode } from '../../declarations/enums/calendar-fast-select-mode.enum';
import { MonthIndex } from '../../declarations/enums/month-index.enum';
import { CalendarMonth } from '../../declarations/interfaces/calendar-month.interface';
import { CalendarTranslation } from '../../declarations/interfaces/calendar-translation.interface';
import { CalendarManipulatorService } from '../../services/calendar-manipulator.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

interface DisplayedMonth {
  year: number;
  month: string;
}

@Component({
  selector: 'pupa-calendar-control-panel',
  templateUrl: './calendar-control-panel.component.html',
  styleUrls: ['./calendar-control-panel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarControlPanelComponent {
  private readonly monthTranslationByIndex$: Observable<Record<MonthIndex, string>> =
    this.calendarTranslationService.translation$.pipe(map((translation: CalendarTranslation) => translation.months));

  public readonly displayedMonth$: Observable<DisplayedMonth> = combineLatest([
    this.calendarManipulatorService.currentCalendarMonth$,
    this.monthTranslationByIndex$,
  ]).pipe(
    map(([calendarMonth, monthTranslationByIndex]: [CalendarMonth, Record<MonthIndex, string>]) => ({
      year: calendarMonth.year,
      month: monthTranslationByIndex[calendarMonth.month],
    }))
  );

  constructor(
    private readonly calendarManipulatorService: CalendarManipulatorService,
    private readonly calendarTranslationService: CalendarTranslationService,
    private readonly calendarStateService: CalendarStateService
  ) {}

  public resetScroll(): void {
    this.calendarManipulatorService.resetScroll('smooth');
  }

  public scrollToNextMonth(): void {
    this.calendarManipulatorService.scrollToNextMonth('smooth');
  }

  public scrollToPreviousMonth(): void {
    this.calendarManipulatorService.scrollToPreviousMonth('smooth');
  }

  public setFastSelectModeMonth(): void {
    this.calendarStateService.setFastSelectMode(CalendarFastSelectMode.Month);
  }

  public setFastSelectModeYear(): void {
    this.calendarStateService.setFastSelectMode(CalendarFastSelectMode.Year);
  }
}

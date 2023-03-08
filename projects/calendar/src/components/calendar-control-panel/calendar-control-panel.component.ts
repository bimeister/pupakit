import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarFastSelectMode } from '../../declarations/enums/calendar-fast-select-mode.enum';
import { MonthIndex } from '../../declarations/enums/month-index.enum';
import { CalendarMonth } from '../../declarations/interfaces/calendar-month.interface';
import { CalendarTranslation } from '../../declarations/interfaces/calendar-translation.interface';
import { CalendarManipulatorService } from '../../services/calendar-manipulator.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

@Component({
  selector: 'pupa-calendar-control-panel',
  templateUrl: './calendar-control-panel.component.html',
  styleUrls: ['./calendar-control-panel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarControlPanelComponent {
  public readonly currentCalendarMonth$: Observable<CalendarMonth> =
    this.calendarManipulatorService.currentCalendarMonth$;

  public readonly monthNameByIndex$: Observable<Record<MonthIndex, string>> =
    this.calendarTranslationService.translation$.pipe(map((translation: CalendarTranslation) => translation.months));

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

import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { CalendarFastSelectMode } from '../../declarations/enums/calendar-fast-select-mode.enum';
import { isDate } from '../../declarations/functions/is-date.function';
import { CalendarMonth } from '../../declarations/interfaces/calendar-month.interface';
import { CalendarConfigService } from '../../services/calendar-config.service';
import { CalendarManipulatorService } from '../../services/calendar-manipulator.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

const ANIMATION_DURATION_MS: number = 200;

@Component({
  selector: 'pupa-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CalendarConfigService, CalendarTranslationService, CalendarManipulatorService, CalendarStateService],
  animations: [
    trigger('fastSelectorAnimation', [
      transition(':enter', [
        style({ opacity: 0, top: '-100%' }),
        animate(`${ANIMATION_DURATION_MS}ms ease-out`, style({ opacity: 1, top: 0 })),
      ]),
      transition(':leave', [
        style({ opacity: 1, top: 0 }),
        animate(`${ANIMATION_DURATION_MS}ms ease-in`, style({ opacity: 0, top: '-100%' })),
      ]),
    ]),
  ],
})
export class CalendarComponent implements OnChanges, OnDestroy {
  @Input()
  public isRange: boolean = false;

  @Input()
  public selected: Date[] | Date = [];

  @Output()
  public readonly select: EventEmitter<Date[]> = new EventEmitter<Date[]>();

  public readonly fastSelectMode: typeof CalendarFastSelectMode = CalendarFastSelectMode;

  public readonly fastSelectMode$: Observable<CalendarFastSelectMode> = this.calendarStateService.fastSelectMode$;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly calendarStateService: CalendarStateService,
    private readonly calendarManipulatorService: CalendarManipulatorService
  ) {
    this.subscription.add(this.emitSelectDatesWhenSelectionChanged());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('isRange')) {
      this.processIsRangeChange(changes.isRange);
    }
    if (changes.hasOwnProperty('selected')) {
      this.processSelectedChange(changes.selected);
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleYearSelect(year: number): void {
    this.calendarStateService.resetFastSelectMode();
    this.calendarManipulatorService.scrollToYear(year, 'auto');
  }

  public handleMonthSelect(month: CalendarMonth): void {
    this.calendarStateService.resetFastSelectMode();
    this.calendarManipulatorService.scrollToMonth(month, 'auto');
  }

  private processIsRangeChange(change: ComponentChange<this, boolean>): void {
    if (isNil(change.currentValue)) {
      return;
    }

    this.calendarStateService.setIsRange(change.currentValue);
  }

  private processSelectedChange(change: ComponentChange<this, Date[] | Date>): void {
    const value: Date[] | Date | undefined = change.currentValue;

    if (isNil(value)) {
      return;
    }

    const dates: Date[] = Array.isArray(value) ? value : [value];

    if (!dates.every(isDate)) {
      return;
    }

    this.calendarStateService.setSelectedDates(dates);
  }

  private emitSelectDatesWhenSelectionChanged(): Subscription {
    return this.calendarStateService.selectedDates$.subscribe((selectedDates: Date[]) =>
      this.select.emit(selectedDates)
    );
  }
}

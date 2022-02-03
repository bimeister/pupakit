import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { filterFalsy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { dayInMs } from '../../../../../internal/constants/day-in-ms.const';
import { DayOfWeek } from '../../../../../internal/declarations/enums/day-of-week.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DatePickerPreviewMode } from '../../../../../internal/declarations/types/date-picker-preview-mode.type';
import { dateClearTime } from '../../../../../internal/helpers/date-clear-time.helper';
import { getDaysInMonth } from '../../../../../internal/helpers/get-days-in-month.helper';
import { isDate } from '../../../../../internal/helpers/is-date.helper';
import { sanitizeDate } from '../../../../../internal/helpers/sanitize-date.helper';
import { DatePickerStateService } from '../../services/date-picker-state.service';

const DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME: Date = dateClearTime(new Date());
const YEARS_IN_SECTION: number = 30;
const YEARS_START_OFFSET: number = 19;

const MIN_DAYS_MONTH: number = 28;

enum DatePickerState {
  Years,
  Months,
  Days,
}

@Component({
  selector: 'pupa-date-picker-simple',
  templateUrl: './date-picker-simple.component.html',
  styleUrls: ['./date-picker-simple.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerSimpleComponent implements OnChanges {
  @Input() public readonly baseDate: Date = DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME;
  public readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME);

  @Input() public readonly isLeftDoubleDatePicker: boolean = false;
  public readonly isLeftDoubleDatePicker$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly isRightDoubleDatePicker: boolean = false;
  public readonly isRightDoubleDatePicker$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public readonly needAddedWeek: boolean = false;
  public readonly needAddedWeek$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() public readonly nextMonthClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() public readonly previousMonthClicked: EventEmitter<void> = new EventEmitter<void>();

  public readonly weekDayNames: string[] = this.datePickerStateService.weekDayNames;

  public readonly datePickerPreviewMode: typeof DatePickerState = DatePickerState;
  public readonly datePickerPreviewMode$: BehaviorSubject<DatePickerState> = new BehaviorSubject<DatePickerState>(
    DatePickerState.Days
  );

  public readonly previewMode$: BehaviorSubject<DatePickerPreviewMode> = this.datePickerStateService.previewMode$;

  public readonly selectedDate$: BehaviorSubject<Date> = this.datePickerStateService.selectedDate$;
  public readonly selectedRange$: BehaviorSubject<Date[]> = this.datePickerStateService.selectedRange$;

  public readonly isSelectionModeDate$: Observable<boolean> = this.datePickerStateService.isSelectionModeDate$;
  public readonly isDatePickerDoubleModeEnabled$: Observable<boolean> = combineLatest([
    this.isLeftDoubleDatePicker$,
    this.isRightDoubleDatePicker$,
  ]).pipe(
    map(([isLeftDoubleDatePicker, isRightDoubleDatePicker]: [boolean, boolean]) =>
      [isLeftDoubleDatePicker, isRightDoubleDatePicker].includes(true)
    )
  );

  public readonly hoveredDate$: BehaviorSubject<Date> = this.datePickerStateService.hoveredDate$;
  public readonly hoveredRange$: Observable<Date[]> = this.datePickerStateService.hoveredRange$;

  public readonly isBackDating$: BehaviorSubject<boolean> = this.datePickerStateService.isBackDating$;
  public readonly availableEndDate$: BehaviorSubject<Date | number> = this.datePickerStateService.availableEndDate$;

  public readonly primarySectionStartDate$: Observable<Date> = this.baseDate$.pipe(
    distinctUntilChanged(),
    filter((baseDate: Date) => isDate(baseDate)),
    map((baseDate: Date) => {
      const baseMonthDay: number = baseDate.getDate();
      const baseDateMs: number = baseDate.valueOf();
      return baseDateMs - (baseMonthDay - 1) * dayInMs;
    }),
    map((sectionStartDateMs: number) => dateClearTime(new Date(sectionStartDateMs)))
  );

  public readonly baseYear$: Observable<number> = this.primarySectionStartDate$.pipe(
    distinctUntilChanged(),
    map((primarySectionStartDate: Date) => primarySectionStartDate.getFullYear())
  );

  public readonly primarySectionEndDate$: Observable<Date> = this.baseDate$.pipe(
    distinctUntilChanged(),
    filter((baseDate: Date) => isDate(baseDate)),
    map((baseDate: Date) => {
      const baseMonthDay: number = baseDate.getDate();
      const baseDateMs: number = baseDate.valueOf();
      const daysInMonth: number = getDaysInMonth(baseDate);

      return Object.is(baseMonthDay, daysInMonth) ? baseDateMs : baseDateMs + (daysInMonth - baseMonthDay) * dayInMs;
    }),
    map((sectionStartDateMs: number) => dateClearTime(new Date(sectionStartDateMs)))
  );

  public readonly primarySectionDates$: Observable<Date[]> = this.primarySectionStartDate$.pipe(
    distinctUntilChanged(),
    map((sectionStartDate: Date) => {
      const daysInMonth: number = getDaysInMonth(sectionStartDate);
      const sectionStartDateMs: number = sectionStartDate.valueOf();
      return new Array(daysInMonth)
        .fill(sectionStartDateMs)
        .map((startDateMs: number, dayInMonth: number) => startDateMs + dayInMonth * dayInMs);
    }),
    map((sectionDatesMs: number[]) => sectionDatesMs.map((dateMs: number) => dateClearTime(new Date(dateMs))))
  );

  public readonly primarySectionLeftOffsetDates$: Observable<Date[]> = this.primarySectionStartDate$.pipe(
    distinctUntilChanged(),
    map((sectionStartDate: Date) => {
      const sectionStartDateMs: number = sectionStartDate.valueOf();
      const lastDayOfPreviousMonthMs: number = sectionStartDateMs - dayInMs;
      return dateClearTime(new Date(lastDayOfPreviousMonthMs));
    }),
    map((previousMonthLastDate: Date) => {
      const previousMonthLastDateDayOfWeek: DayOfWeek = previousMonthLastDate.getDay();
      if (previousMonthLastDateDayOfWeek === DayOfWeek.Sunday) {
        return [];
      }
      const previousMonthLastDateMs: number = previousMonthLastDate.valueOf();
      const visibleDaysCount: number = previousMonthLastDateDayOfWeek;
      return new Array(visibleDaysCount)
        .fill(previousMonthLastDateMs)
        .map((lastMonthDateMs: number, multiplier: number) => lastMonthDateMs - multiplier * dayInMs);
    }),
    map((previousMonthDatesMs: number[]) => [...previousMonthDatesMs].reverse()),
    map((reversedPreviousMonthDatesMs: number[]) =>
      reversedPreviousMonthDatesMs.map((dateMs: number) => dateClearTime(new Date(dateMs)))
    )
  );

  public readonly primarySectionRightOffsetDates$: Observable<Date[]> = this.needAddedWeek$.pipe(
    switchMap((needAddedWeek: boolean) =>
      this.primarySectionEndDate$.pipe(
        distinctUntilChanged(),
        map((sectionEndDate: Date) => {
          const currentSectionDate: Date = new Date(sectionEndDate);
          const month: number = currentSectionDate.getMonth() + 1;
          currentSectionDate.setDate(1);
          currentSectionDate.setMonth(month);

          return [sectionEndDate, dateClearTime(new Date(currentSectionDate))];
        }),
        withLatestFrom(this.previewMode$),
        map(([[currentSectionEndDate, nextMonthFirstDate], previewMode]: [[Date, Date], DatePickerPreviewMode]) => {
          const nextMonthFirstDateDayOfWeek: DayOfWeek = nextMonthFirstDate.getDay();
          const nextMonthFirstDateMs: number = nextMonthFirstDate.valueOf();

          const currentDaysInMonth: number = getDaysInMonth(currentSectionEndDate);
          const currentMonthIsSmall: boolean = currentDaysInMonth === MIN_DAYS_MONTH;
          const currentMonthPreviewModeIsDouble: boolean = previewMode === 'double';
          const nextMonthFirstDateDayIsMonday: boolean = nextMonthFirstDateDayOfWeek === DayOfWeek.Monday;
          const nextMonthFirstDateDayIsSunday: boolean = nextMonthFirstDateDayOfWeek === DayOfWeek.Sunday;

          const currentMonthIsSmallAndInDouble: boolean = currentMonthIsSmall && currentMonthPreviewModeIsDouble;

          if (nextMonthFirstDateDayIsMonday && !currentMonthIsSmallAndInDouble) {
            return [];
          }
          const visibleDaysCount: number = nextMonthFirstDateDayIsSunday ? 1 : 8 - nextMonthFirstDateDayOfWeek;

          const resultDaysCount: number = needAddedWeek ? visibleDaysCount + 7 : visibleDaysCount;

          return new Array(resultDaysCount)
            .fill(nextMonthFirstDateMs)
            .map((lastMonthDateMs: number, multiplier: number) => lastMonthDateMs + multiplier * dayInMs);
        }),
        map((reversedPreviousMonthDatesMs: number[]) =>
          reversedPreviousMonthDatesMs.map((dateMs: number) => dateClearTime(new Date(dateMs)))
        )
      )
    )
  );

  public readonly primarySectionYears$: Observable<number[]> = this.primarySectionStartDate$.pipe(
    distinctUntilChanged(),
    map((sectionStartDate: Date) => sectionStartDate.getFullYear()),
    map((currentYear: number) => {
      const startYearInSection: number =
        Math.floor(currentYear / YEARS_IN_SECTION) * YEARS_IN_SECTION - YEARS_START_OFFSET;

      const resultStartYearInSection: number =
        startYearInSection + YEARS_IN_SECTION > currentYear ? startYearInSection : currentYear;

      return Array(YEARS_IN_SECTION)
        .fill(0)
        .map((_year: number, index: number) => resultStartYearInSection + index);
    })
  );

  public readonly primarySectionYearsStartYear$: Observable<number> = this.primarySectionYears$.pipe(
    map((years: number[]) => years[0])
  );
  public readonly primarySectionYearsEndYear$: Observable<number> = this.primarySectionYears$.pipe(
    map((years: number[]) => years[years.length - 1])
  );

  constructor(private readonly datePickerStateService: DatePickerStateService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processBaseDateChange(changes?.baseDate);
    this.processIsLeftDoubleDatePickerChange(changes?.isLeftDoubleDatePicker);
    this.processIsRightDoubleDatePickerChange(changes?.isRightDoubleDatePicker);
    this.processNeedAddedWeekChange(changes?.needAddedWeek);
  }

  public switchToPreviousMonth(): void {
    this.baseDate$
      .pipe(
        take(1),
        map((currentBaseDate: Date) => {
          const month: number = currentBaseDate.getMonth() - 1;
          currentBaseDate.setDate(1);
          currentBaseDate.setMonth(month);
          return currentBaseDate;
        }),
        map((newBaseDateMs: Date) => dateClearTime(new Date(newBaseDateMs)))
      )
      .subscribe((newBaseDate: Date) => {
        this.baseDate$.next(newBaseDate);
        this.previousMonthClicked.emit();
      });
  }

  public switchToNextMonth(): void {
    this.baseDate$
      .pipe(
        take(1),
        map((currentBaseDate: Date) => {
          const month: number = currentBaseDate.getMonth() + 1;
          currentBaseDate.setMonth(month);
          currentBaseDate.setDate(1);
          return currentBaseDate;
        }),
        map((newBaseDateMs: Date) => dateClearTime(new Date(newBaseDateMs)))
      )
      .subscribe((newBaseDate: Date) => {
        this.baseDate$.next(newBaseDate);
        this.nextMonthClicked.emit();
      });
  }

  public switchToNextYear(): void {
    this.baseYear$.pipe(take(1)).subscribe((year: number) => this.switchToYear(year + 1));
  }

  public switchToPreviousYear(): void {
    this.baseYear$.pipe(take(1)).subscribe((year: number) => this.switchToYear(year - 1));
  }

  public switchToYear(year: number): void {
    this.baseDate$
      .pipe(
        take(1),
        map((currentBaseDate: Date) => dateClearTime(new Date(currentBaseDate.setFullYear(year))))
      )
      .subscribe((newBaseDate: Date) => {
        this.datePickerPreviewMode$.next(DatePickerState.Months);
        this.baseDate$.next(newBaseDate);
      });
  }

  public switchToMonth(month: number): void {
    this.baseDate$
      .pipe(
        take(1),
        map((currentBaseDate: Date) => dateClearTime(new Date(currentBaseDate.setMonth(month))))
      )
      .subscribe((newBaseDate: Date) => {
        this.datePickerPreviewMode$.next(DatePickerState.Days);
        this.baseDate$.next(newBaseDate);
      });
  }

  public switchToPreviousYearsPeriod(): void {
    this.primarySectionYearsStartYear$
      .pipe(
        take(1),
        switchMap((primarySectionYearsStartYear: number) => {
          const nextSectionYearsStartYear: number = primarySectionYearsStartYear - YEARS_IN_SECTION;

          return this.baseDate$.pipe(
            take(1),
            map((currentBaseDate: Date) =>
              dateClearTime(new Date(currentBaseDate.setFullYear(nextSectionYearsStartYear)))
            )
          );
        })
      )
      .subscribe((newBaseDate: Date) => {
        this.baseDate$.next(newBaseDate);
      });
  }

  public switchToNextYearsPeriod(): void {
    this.primarySectionYearsStartYear$
      .pipe(
        take(1),
        switchMap((primarySectionYearsStartYear: number) => {
          const nextSectionYearsStartYear: number = primarySectionYearsStartYear + YEARS_IN_SECTION;

          return this.baseDate$.pipe(
            take(1),
            map((currentBaseDate: Date) =>
              dateClearTime(new Date(currentBaseDate.setFullYear(nextSectionYearsStartYear)))
            )
          );
        })
      )
      .subscribe((newBaseDate: Date) => {
        this.baseDate$.next(newBaseDate);
      });
  }

  public switchDatePickerPreviewMode(mode: DatePickerState): void {
    this.isDatePickerDoubleModeEnabled$
      .pipe(take(1), filterFalsy())
      .subscribe(() => this.datePickerPreviewMode$.next(mode));
  }

  public processDateSelection(date: Date): void {
    this.datePickerStateService.processDateSelection(date);
  }

  public processDateHover(date: Date): void {
    this.datePickerStateService.processDateHover(date);
  }

  public isSameDate(dateA: Date, dateB: Date): boolean {
    return this.datePickerStateService.isSameDate(dateA, dateB);
  }

  public dateIsInDateRange(date: Date, dateRange: Date[]): boolean {
    return this.datePickerStateService.dateIsInDateRange(date, dateRange);
  }

  public dateIsInDateArray(date: Date, dateArray: Date[]): boolean {
    return this.datePickerStateService.dateIsInDateArray(date, dateArray);
  }

  public dateIsRangeStartDate(date: Date, dateRange: Date[]): boolean {
    return this.datePickerStateService.dateIsRangeStartDate(date, dateRange);
  }

  public dateIsRangeEndDate(date: Date, dateRange: Date[]): boolean {
    return this.datePickerStateService.dateIsRangeEndDate(date, dateRange);
  }

  public dateIsNotAvailable(date: Date, isBackDating: boolean, availableEndDate: Date | number): boolean {
    return this.datePickerStateService.dateIsNotAvailable(date, isBackDating, availableEndDate);
  }

  public isDateStartInHoveredAndSelectedRange(date: Date, hoveredRange: Date[], selectedRange: Date[]): boolean {
    return this.datePickerStateService.isDateStartInHoveredAndSelectedRange(date, hoveredRange, selectedRange);
  }

  public isDateEndInHoveredAndSelectedRange(date: Date, hoveredRange: Date[], selectedRange: Date[]): boolean {
    return this.datePickerStateService.isDateEndInHoveredAndSelectedRange(date, hoveredRange, selectedRange);
  }

  private processBaseDateChange(change: ComponentChange<this, Date>): void {
    const updatedValue: Date | undefined = change?.currentValue;

    if (isNil(updatedValue) || !isDate(updatedValue)) {
      return;
    }
    const sanitizedDate: Date = sanitizeDate(updatedValue);
    const sanitizedDateWithClearedTime: Date = dateClearTime(sanitizedDate);
    this.baseDate$.next(sanitizedDateWithClearedTime);
  }

  private processIsLeftDoubleDatePickerChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.isLeftDoubleDatePicker$.next(updatedValue);
  }

  private processIsRightDoubleDatePickerChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.isRightDoubleDatePicker$.next(updatedValue);
  }

  private processNeedAddedWeekChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.needAddedWeek$.next(updatedValue);
  }
}

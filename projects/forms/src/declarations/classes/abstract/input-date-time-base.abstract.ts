import { DatePipe } from '@angular/common';
import { Directive, inject, Input, NgZone, OnChanges, OnInit, Optional, ViewChild } from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  ComponentChange,
  ComponentChanges,
  subscribeOutsideAngular,
  TimeDigitFormatPipe,
} from '@bimeister/pupakit.common';
import { filterNotNil, filterTruthy, isEmpty, isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take, withLatestFrom } from 'rxjs/operators';
import { DroppableComponent } from '../../../components/droppable/components/droppable/droppable.component';
import { dateClearTime } from '../../functions/date-clear-time.function';
import { getDaysInMonth } from '../../functions/get-days-in-month.function';
import { ParsedDateData } from '../../interfaces/parsed-date-data.interface';
import { ValueType } from '../../types/input-value.type';
import { InputDateTimeHelper } from '../input-date-time-helper.class';
import { InputBase } from './input-base.abstract';

const DEFAULT_DATE: Date = new Date();
const DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME: Date = dateClearTime(DEFAULT_DATE);
const DATE_FORMAT: string = 'dd.MM.yyyy';

const MAX_HOURS: number = 23;
const MAX_MINUTES: number = 59;
const MAX_SECONDS: number = 59;

const PLACEHOLDER_DATE: string = '00.00.0000';
const SIZE_PLACEHOLDER_DATE: number = PLACEHOLDER_DATE.length;

const PLACEHOLDER_TIME: string = '00:00:00';
const SIZE_PLACEHOLDER_TIME: number = PLACEHOLDER_TIME.length;

const MONTH_START_VALUE: number = 0;
const MONTH_END_VALUE: number = 11;

const HOUR_START_POSITION: number = 0;
const HOUR_END_POSITION: number = 2;

const MINUTES_START_POSITION: number = 3;
const MINUTES_END_POSITION: number = 5;

const SECONDS_START_POSITION: number = 6;
const SECONDS_END_POSITION: number = 8;

@Directive()
export abstract class InputDateTimeBase extends InputBase<ValueType> implements OnChanges, OnInit {
  @ViewChild('droppable', { static: true }) public readonly droppableComponent: DroppableComponent;

  @Input() public isFixedSize: boolean = true;
  public readonly isFixedSize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  @Input() public isBackDating: boolean = true;
  public readonly isBackDating$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  @Input() public availableEndDate: Date | number = Infinity;
  public readonly availableEndDate$: BehaviorSubject<Date | number> = new BehaviorSubject<Date | number>(Infinity);

  @Input() public availableStartDate: Date | number = 0;
  public readonly availableStartDate$: BehaviorSubject<Date | number> = new BehaviorSubject<Date | number>(-Infinity);

  @Input() public defaultTime: Date | null = null;

  public readonly isIconHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly valueIsNotEmpty$: Observable<boolean> = this.value$.pipe(map((value: string) => !isEmpty(value)));
  public readonly dateToResetSwitcherEnabled$: Observable<boolean> = combineLatest([
    this.isIconHovered$,
    this.valueIsNotEmpty$,
    this.withReset$,
    this.isDisabled$,
  ]).pipe(
    map(
      ([isIconHovered, valueIsNotEmpty, withReset, isDisabled]: [boolean, boolean, boolean, boolean]) =>
        isIconHovered && valueIsNotEmpty && withReset && !isDisabled
    )
  );

  public readonly hours$: Observable<number> = this.value$.pipe(
    map((value: string) =>
      !isEmpty(value) && value.length >= HOUR_END_POSITION
        ? Number(value.slice(HOUR_START_POSITION, HOUR_END_POSITION))
        : -1
    ),
    filterNotNil(),
    filter((hours: number) => hours <= MAX_HOURS)
  );

  public readonly minutes$: Observable<number> = this.value$.pipe(
    map((value: string) =>
      !isEmpty(value) && value.length >= MINUTES_END_POSITION
        ? Number(value.slice(MINUTES_START_POSITION, MINUTES_END_POSITION))
        : -1
    ),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_MINUTES)
  );

  public readonly seconds$: Observable<number> = this.value$.pipe(
    map((value: string) =>
      !isEmpty(value) && value.length === SECONDS_END_POSITION ? Number(value.slice(SECONDS_START_POSITION)) : -1
    ),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_SECONDS)
  );

  public readonly date$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    distinctUntilChanged(),
    filter((value: string) => isEmpty(value) || value.length >= SIZE_PLACEHOLDER_DATE),
    map((value: string) => value.slice(0, SIZE_PLACEHOLDER_DATE)),
    map((value: string) => this.getParsedDate(value)),
    withLatestFrom(combineLatest([this.isBackDating$, this.availableStartDate$, this.availableEndDate$])),
    filter(
      ([date, [isBackDating, availableStartDate, availableEndDate]]: [Date, [boolean, Date, Date]]) =>
        !this.dateIsNotAvailable(date, isBackDating, availableStartDate, availableEndDate)
    ),
    map(([date, _]: [Date, [boolean, Date, Date]]) => date)
  );

  private readonly ngZone: NgZone = inject(NgZone);

  constructor(
    private readonly timeFormatPipe: TimeDigitFormatPipe,
    public readonly datePipe: DatePipe,
    @Optional() ngControl: NgControl
  ) {
    super(ngControl);

    this.setWithDefaultRightIconState(true);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.subscription.add(this.handleClickAndTouchStart());
  }

  public processWindowClick(): void {
    this.isFocused$.next(false);
  }

  public handleContainerClick(event: Event): void {
    this.handleFocusOnContainerClick();

    this.isDisabled$
      .pipe(
        take(1),
        map((isDisabled: boolean) => isDisabled || this.droppableComponent.isOpened),
        filterTruthy()
      )
      .subscribe(() => event.stopPropagation());
  }

  public handleContainerStartEvents(event: Event): void {
    if (!this.droppableComponent.isOpened) {
      return;
    }
    event.stopPropagation();
  }

  public selectHours(hours: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedHours: string = InputDateTimeHelper.getUpdatedValueStringAfterSelectHours(hours, value);
      this.updateValue(parsedHours);
    });
  }

  public selectMinutes(minutes: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedMinutes: string = InputDateTimeHelper.getUpdatedValueStringAfterSelectMinutes(minutes, value);
      this.updateValue(parsedMinutes);
    });
  }

  public selectSeconds(seconds: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedSeconds: string = InputDateTimeHelper.getUpdatedValueStringAfterSelectSeconds(seconds, value);
      this.updateValue(parsedSeconds);
    });
  }

  public selectDateTimeHours(hours: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const valueTime: string = isNil(value) ? '' : value.slice(SIZE_PLACEHOLDER_DATE).trim();

      const parsedHours: string = InputDateTimeHelper.getUpdatedValueStringAfterSelectHours(hours, valueTime);
      const transformedHours: string = parsedHours.slice(0, SIZE_PLACEHOLDER_TIME);

      if (isNil(value) || value.length < SIZE_PLACEHOLDER_DATE) {
        const parsedDefaultDate: string = this.datePipe.transform(DEFAULT_DATE, DATE_FORMAT);
        this.updateValue(`${parsedDefaultDate} ${transformedHours}`);
        return;
      }

      const addedExistingValueInput: string = value.slice(0, SIZE_PLACEHOLDER_DATE);

      this.updateValue(`${addedExistingValueInput} ${transformedHours}`);
    });
  }

  public selectDateTimeMinutes(minutes: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const valueTime: string = isNil(value) ? '' : value.slice(SIZE_PLACEHOLDER_DATE).trim();

      const parsedMinutes: string = InputDateTimeHelper.getUpdatedValueStringAfterSelectMinutes(minutes, valueTime);
      const transformedMinutes: string = parsedMinutes.slice(0, SIZE_PLACEHOLDER_TIME);

      if (isNil(value) || value.length < SIZE_PLACEHOLDER_DATE) {
        const parsedDefaultDate: string = this.datePipe.transform(DEFAULT_DATE, DATE_FORMAT);
        this.updateValue(`${parsedDefaultDate} ${transformedMinutes}`);
        return;
      }

      const addedExistingValueInput: string = value.slice(0, SIZE_PLACEHOLDER_DATE);

      this.updateValue(`${addedExistingValueInput} ${transformedMinutes}`);
    });
  }

  public selectDateTimeSeconds(seconds: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const valueTime: string = isNil(value) ? '' : value.slice(SIZE_PLACEHOLDER_DATE).trim();

      const parsedSeconds: string = InputDateTimeHelper.getUpdatedValueStringAfterSelectSeconds(seconds, valueTime);
      const transformedSeconds: string = parsedSeconds.slice(0, SIZE_PLACEHOLDER_TIME);

      if (isNil(value) || value.length < SIZE_PLACEHOLDER_DATE) {
        const parsedDefaultDate: string = this.datePipe.transform(DEFAULT_DATE, DATE_FORMAT);
        this.updateValue(`${parsedDefaultDate} ${transformedSeconds}`);
        return;
      }

      const addedExistingValueInput: string = value.slice(0, SIZE_PLACEHOLDER_DATE);

      this.updateValue(`${addedExistingValueInput} ${transformedSeconds}`);
    });
  }

  public selectDate(selectedDate: Date): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const day: number = selectedDate.getDate();
      const month: number = selectedDate.getMonth() + 1;
      const year: number = selectedDate.getFullYear();

      const parsedDay: string = this.timeFormatPipe.transform(day);
      const parsedMonth: string = this.timeFormatPipe.transform(month);

      const dateInputString: string = `${parsedDay}.${parsedMonth}.${year}`;

      const addedExistingValueInput: string = isNil(value) ? '' : value.slice(SIZE_PLACEHOLDER_DATE);

      this.updateValue(`${dateInputString}${addedExistingValueInput}`);
    });
  }

  public selectRange(range: [Date, Date]): void {
    const firstDate: Date = range[0];
    const secondDate: Date = range[1];

    const convertedFirstDate: string = this.datePipe.transform(firstDate, DATE_FORMAT);
    const convertedSecondDate: string = this.datePipe.transform(secondDate, DATE_FORMAT);

    const isRangeCorrect: boolean = firstDate <= secondDate;
    const updatedValue: string = isRangeCorrect
      ? `${convertedFirstDate} - ${convertedSecondDate}`
      : `${convertedSecondDate} - ${convertedFirstDate}`;

    this.updateValue(updatedValue);
  }

  public getParsedDate(value: string): Date {
    const { day, month, year }: ParsedDateData = InputDateTimeHelper.getParsedDateData(value);
    const convertedYear: number = Number(year);
    const convertedMonth: number = Number(month) - 1;
    const convertedDay: number = Number(day);

    if (convertedMonth > MONTH_END_VALUE || convertedMonth < MONTH_START_VALUE) {
      return null;
    }

    const testDate: Date = new Date(convertedYear, convertedMonth, 1);
    const daysInMonth: number = getDaysInMonth(testDate);

    if (convertedDay > daysInMonth) {
      return null;
    }

    const date: Date = new Date(convertedYear, convertedMonth, convertedDay);
    return date;
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsFixedSizeChange(changes?.isFixedSize);
    this.processIsBackDatingChange(changes?.isBackDating);
    this.processAvailableEndDateChange(changes?.availableEndDate);
    this.processAvailableStartDateChange(changes?.availableStartDate);
    super.ngOnChanges(changes);
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public handleFocusEvent(focusEvent: FocusEvent): void {
    focusEvent.stopPropagation();
    this.emitFocusEvent(focusEvent);
  }

  public reset(): void {
    combineLatest([this.withReset$, this.isDisabled$])
      .pipe(
        map(([withReset, isDisabled]: [boolean, boolean]) => withReset && !isDisabled),
        take(1),
        filterTruthy()
      )
      .subscribe(() => this.updateValue(''));
    this.inputElementRef.nativeElement.focus();
  }

  public clearInputValue(): void {
    combineLatest([this.isIconHovered$, this.valueIsNotEmpty$, this.isValid$])
      .pipe(
        take(1),
        filter(
          ([isIconHovered, valueIsNotEmpty, isValid]: [boolean, boolean, boolean]) =>
            isIconHovered && valueIsNotEmpty && isValid
        )
      )
      .subscribe(() => this.updateValue(''));
  }

  public dateIsNotAvailable(
    date: Date | null,
    isBackDating: boolean,
    availableStartDate: Date,
    availableEndDate: Date
  ): boolean {
    return (
      (!isNil(date) && !isBackDating && date < DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME) ||
      date < availableStartDate ||
      date > availableEndDate
    );
  }

  private processIsFixedSizeChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isFixedSize$.next(updatedValue);
  }

  private processIsBackDatingChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.isBackDating$.next(updatedValue);
  }

  private processAvailableEndDateChange(change: ComponentChange<this, Date | number>): void {
    const updatedValue: Date | number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.availableEndDate$.next(updatedValue);
  }

  private processAvailableStartDateChange(change: ComponentChange<this, Date | number>): void {
    const updatedValue: Date | number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.availableStartDate$.next(updatedValue);
  }

  private handleClickAndTouchStart(): Subscription {
    return merge(fromEvent(window, 'click'), fromEvent(window, 'touchstart'))
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => this.processWindowClick());
  }
}

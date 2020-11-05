import { DatePipe } from '@angular/common';
import { Directive, HostListener, Input, OnChanges, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { filterNotNil, isEmpty, isNil } from '@meistersoft/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { InputDateTimeStateService } from '../../../../lib/components/input/services/input-date-time-state.service';
import { getDaysInMonth } from '../../../helpers/get-days-in-month.helper';
import { TimeFormatPipe } from '../../../pipes/time-format.pipe';
import { BrowserService } from '../../../shared/services/browser.service';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { ParsedDateData } from '../../interfaces/parsed-date-data.interface';
import { ValueType } from '../../types/input-value.type';
import { InputBase } from './input-base.abstract';

const DEFAULT_DATE: Date = new Date();
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

const DEFAULT_ERROR_MESSAGE: string = 'Недопустимое значение';

@Directive()
export abstract class InputDateTimeBase extends InputBase<ValueType> implements OnChanges {
  @Input() public readonly isFixedSize: boolean = true;
  public readonly isFixedSize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  @Input() public readonly isTableMode: boolean = false;
  public readonly isTableMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public errorTitle: string = DEFAULT_ERROR_MESSAGE;
  public readonly errorTitle$: BehaviorSubject<string> = new BehaviorSubject(DEFAULT_ERROR_MESSAGE);

  public readonly isIconHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly valueIsNotEmpty$: Observable<boolean> = this.value$.pipe(map((value: string) => !isEmpty(value)));

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
    filter((value: string) => value.length >= SIZE_PLACEHOLDER_DATE),
    map((value: string) => value.slice(0, SIZE_PLACEHOLDER_DATE)),
    map((value: string) => this.getParsedDate(value))
  );

  constructor(
    public readonly inputDateTimeStateService: InputDateTimeStateService,
    private readonly timeFormatPipe: TimeFormatPipe,
    browserService: BrowserService,
    public readonly datePipe: DatePipe,
    @Optional() ngControl: NgControl
  ) {
    super(browserService, ngControl);
  }

  @HostListener('window:click')
  @HostListener('window:touchstart')
  public processWindowClick(): void {
    this.isFocused$.next(false);
  }

  public selectHours(hours: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedHours: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectHours(hours, value);
      this.updateValue(parsedHours);
    });
  }

  public selectMinutes(minutes: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedMinutes: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectMinutes(
        minutes,
        value
      );
      this.updateValue(parsedMinutes);
    });
  }

  public selectSeconds(seconds: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const parsedSeconds: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectSeconds(
        seconds,
        value
      );
      this.updateValue(parsedSeconds);
    });
  }

  public selectDateTimeHours(hours: number): void {
    this.value$.pipe(take(1)).subscribe((value: string) => {
      const valueTime: string = isNil(value) ? '' : value.slice(SIZE_PLACEHOLDER_DATE).trim();

      const parsedHours: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectHours(
        hours,
        valueTime
      );
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

      const parsedMinutes: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectMinutes(
        minutes,
        valueTime
      );
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

      const parsedSeconds: string = this.inputDateTimeStateService.getUpdatedValueStringAfterSelectSeconds(
        seconds,
        valueTime
      );
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
    const { day, month, year }: ParsedDateData = this.inputDateTimeStateService.getParsedDateData(value);
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
    this.processIsTableChange(changes?.isTableMode);
    this.processErrorTitleChange(changes?.errorTitle);
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public handleFocusEvent(focusEvent: FocusEvent): void {
    focusEvent.stopPropagation();
    this.emitFocusEvent(focusEvent);
  }

  public handleIconHover(isHovered: boolean): void {
    this.isIconHovered$.next(isHovered);
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

  private processIsFixedSizeChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isFixedSize$.next(updatedValue);
  }

  private processIsTableChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isTableMode$.next(updatedValue);
  }

  private processErrorTitleChange(change: ComponentChange<this, string>): void {
    const updatedValue: string | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.errorTitle$.next(updatedValue);
  }
}

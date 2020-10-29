import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Input, Optional, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { filterNotNil, isEmpty, isNil } from '@meistersoft/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ParsedDateData } from '../../../../../internal/declarations/interfaces/parsed-date-data.interface';
import { ValueType } from '../../../../../internal/declarations/types/input-value.type';
import { getDaysInMonth } from '../../../../../internal/helpers/get-days-in-month.helper';
import { TimeFormatPipe } from '../../../../../internal/pipes/time-format.pipe';
import { InputDateTimeStateService } from '../../services/input-date-time-state.service';

const DEFAULT_DATE: Date = new Date();
const DATE_FORMAT: string = 'dd.MM.yyyy';

const PLACEHOLDER_TIME: string = '00:00';
const PLACEHOLDER_DATE: string = '00.00.0000';
const PLACEHOLDER: string = `${PLACEHOLDER_DATE} ${PLACEHOLDER_TIME}`;

const MAX_LENGTH_INPUT_VALUE: number = PLACEHOLDER.length;
const SIZE_PLACEHOLDER_TIME: number = PLACEHOLDER_TIME.length;
const SIZE_PLACEHOLDER_DATE: number = PLACEHOLDER_DATE.length;

const MAX_HOURS: number = 23;
const MAX_MINUTES: number = 59;

@Component({
  selector: 'pupa-input-date-time',
  templateUrl: './input-date-time.component.html',
  styleUrls: ['./input-date-time.component.scss'],
  providers: [TimeFormatPipe, DatePipe, InputDateTimeStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateTimeComponent extends InputBase<ValueType> {
  @Input() public readonly isFixedSize: boolean = true;
  public readonly isFixedSize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly date$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    filter((value: string) => value.length >= SIZE_PLACEHOLDER_DATE),
    map((value: string) => value.slice(0, SIZE_PLACEHOLDER_DATE)),
    map((value: string) => {
      const { day, month, year }: ParsedDateData = this.inputDateTimeStateService.getParsedDateData(value);
      const convertedYear: number = Number(year);
      const convertedMonth: number = Number(month) - 1;
      const convertedDay: number = Number(day);

      if (convertedMonth > 11 || convertedMonth < 0) {
        return null;
      }

      const testDate: Date = new Date(convertedYear, convertedMonth, 1);
      const daysInMonth: number = getDaysInMonth(testDate);

      if (convertedDay > daysInMonth) {
        return null;
      }

      const date: Date = new Date(convertedYear, convertedMonth, convertedDay);
      return date;
    })
  );

  public readonly hours$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.slice(SIZE_PLACEHOLDER_DATE)),
    map((value: string) => value.trim()),
    map((value: string) => (!isEmpty(value) && value.length >= 2 ? Number(value.slice(0, 2)) : -1)),
    filterNotNil(),
    filter((hours: number) => hours <= MAX_HOURS)
  );

  public readonly minutes$: Observable<number> = this.value$.pipe(
    filterNotNil(),
    map((value: string) => value.slice(SIZE_PLACEHOLDER_DATE)),
    map((value: string) => value.trim()),
    map((value: string) => (!isEmpty(value) && value.length === 5 ? Number(value.slice(3)) : -1)),
    filterNotNil(),
    filter((minutes: number) => minutes <= MAX_MINUTES)
  );

  public readonly maxLengthInputValue: number = MAX_LENGTH_INPUT_VALUE;

  public readonly dateIsFilled$: Observable<boolean> = this.value$.pipe(
    map((value: string) => (isNil(value) ? false : value.trim().length === SIZE_PLACEHOLDER_DATE))
  );

  public readonly isIconHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly valueIsNotEmpty$: Observable<boolean> = this.value$.pipe(map((value: string) => !isEmpty(value)));

  public readonly placeholderPreviewLeft$: Observable<string> = this.value$.pipe(
    map((value: string) => (isEmpty(value) ? '' : `${value}`))
  );

  public readonly placeholderPreviewRight$: Observable<string> = this.value$.pipe(
    map((value: string) => {
      if (isEmpty(value)) {
        return PLACEHOLDER;
      }

      const valueTrimmed: string = value.trim();
      const valueTrimmedLength: number = valueTrimmed.length;
      if (valueTrimmedLength === SIZE_PLACEHOLDER_DATE) {
        return `${PLACEHOLDER.slice(valueTrimmedLength + 1)}`;
      }

      return `${PLACEHOLDER.slice(value.length)}`;
    })
  );

  constructor(
    private readonly inputDateTimeStateService: InputDateTimeStateService,
    private readonly timeFormatPipe: TimeFormatPipe,
    private readonly datePipe: DatePipe,
    @Optional() public readonly ngControl: NgControl
  ) {
    super(ngControl);
  }

  @HostListener('window:click')
  @HostListener('window:touchstart')
  public processWindowClick(): void {
    this.isFocused$.next(false);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processIsFixedSizeChange(changes?.isFixedSize);
  }

  public handleFocusEvent(focusEvent: FocusEvent): void {
    focusEvent.stopPropagation();
    this.emitFocusEvent(focusEvent);
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

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public handleIconHover(isHovered: boolean): void {
    this.isIconHovered$.next(isHovered);
  }

  public selectHours(hours: number): void {
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
      }

      const addedExistingValueInput: string = value.slice(0, SIZE_PLACEHOLDER_DATE);

      this.updateValue(`${addedExistingValueInput} ${transformedHours}`);
    });
  }

  public selectMinutes(minutes: number): void {
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
      }

      const addedExistingValueInput: string = value.slice(0, SIZE_PLACEHOLDER_DATE);

      this.updateValue(`${addedExistingValueInput} ${transformedMinutes}`);
    });
  }

  public clearInputValue(): void {
    combineLatest([this.isIconHovered$, this.valueIsNotEmpty$])
      .pipe(
        take(1),
        filter(([isIconHovered, valueIsNotEmpty]: [boolean, boolean]) => isIconHovered && valueIsNotEmpty)
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
}

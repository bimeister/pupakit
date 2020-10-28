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

const PLACEHOLDER: string = '00.00.0000';
const MAX_LENGTH_INPUT_VALUE: number = PLACEHOLDER.length;

@Component({
  selector: 'pupa-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [TimeFormatPipe, InputDateTimeStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateComponent extends InputBase<ValueType> {
  @Input() public readonly isFixedSize: boolean = true;
  public readonly isFixedSize$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly date$: Observable<Date> = this.value$.pipe(
    filterNotNil(),
    filter((value: string) => value.length === MAX_LENGTH_INPUT_VALUE),
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

  public readonly maxLengthInputValue: number = MAX_LENGTH_INPUT_VALUE;

  public readonly isIconHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly valueIsNotEmpty$: Observable<boolean> = this.value$.pipe(map((value: string) => !isEmpty(value)));

  public readonly placeholderPreviewLeft$: Observable<string> = this.value$.pipe(
    map((value: string) => (isEmpty(value) ? '' : `${value}`))
  );

  public readonly placeholderPreviewRight$: Observable<string> = this.value$.pipe(
    map((value: string) => (isEmpty(value) ? PLACEHOLDER : `${PLACEHOLDER.slice(value.length)}`))
  );

  constructor(
    private readonly inputDateTimeStateService: InputDateTimeStateService,
    private readonly timeFormatPipe: TimeFormatPipe,
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
    const day: number = selectedDate.getDate();
    const month: number = selectedDate.getMonth() + 1;
    const year: number = selectedDate.getFullYear();

    const parsedDay: string = this.timeFormatPipe.transform(day);
    const parsedMonth: string = this.timeFormatPipe.transform(month);

    const dateInputString: string = `${parsedDay}.${parsedMonth}.${year}`;
    this.updateValue(dateInputString);
  }

  public setValue(value: ValueType): void {
    const serializedValue: string = isNil(value) ? '' : String(value);
    this.value$.next(serializedValue);
  }

  public handleIconHover(isHovered: boolean): void {
    this.isIconHovered$.next(isHovered);
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

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { filterFalsy, filterNotNil, filterTruthy, isEqual, isNil } from '@meistersoft/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DatePickerPreviewMode } from '../../../../../internal/declarations/types/date-picker-preview-mode.type';
import { DatePickerSelectionMode } from '../../../../../internal/declarations/types/date-picker-selection-mode.type';
import { dateClearTime } from '../../../../../internal/helpers/date-clear-time.helper';
import { isDate } from '../../../../../internal/helpers/is-date.helper';
import { sanitizeDate } from '../../../../../internal/helpers/sanitize-date.helper';
import { DatePickerStateService } from '../../services/date-picker-state.service';

const VALID_DATES_COUNT: number = 2;
const DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME: Date = dateClearTime(new Date());

@Component({
  selector: 'pupa-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [DatePickerStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnDestroy {
  public readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME);

  @Input() public readonly selectionMode: DatePickerSelectionMode = 'range';
  private readonly selectionMode$: BehaviorSubject<DatePickerSelectionMode> = this.datePickerStateService
    .selectionMode$;

  @Input() public readonly selectedDate: Date;
  public readonly selectedDate$: BehaviorSubject<Date> = this.datePickerStateService.selectedDate$;

  @Input() public readonly selectedRange: Date[];
  public readonly selectedRange$: BehaviorSubject<Date[]> = this.datePickerStateService.selectedRange$;

  @Input() public readonly previewMode: DatePickerPreviewMode;
  public readonly previewMode$: BehaviorSubject<DatePickerPreviewMode> = this.datePickerStateService.previewMode$;

  @Input() public readonly withSeconds: boolean = false;
  public readonly withSeconds$: BehaviorSubject<boolean> = this.datePickerStateService.withSeconds$;

  @Output() public readonly date: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public readonly range: EventEmitter<[Date, Date]> = new EventEmitter<[Date, Date]>();

  public readonly isSelectionModeDate$: Observable<boolean> = this.datePickerStateService.isSelectionModeDate$;
  public readonly hoveredDate$: BehaviorSubject<Date> = this.datePickerStateService.hoveredDate$;

  private readonly subscription: Subscription = new Subscription();
  constructor(private readonly datePickerStateService: DatePickerStateService) {
    this.subscription.add(this.handleSelectedDateForEmitting()).add(this.handleSelectedRangeForEmitting());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processSelectionModeChange(changes?.selectionMode);
    this.processSelectedDateChange(changes?.selectedDate);
    this.processSelectedRangeChange(changes?.selectedRange);
    this.processPreviewModeChange(changes?.previewMode);
    this.processWithSecondsChange(changes?.withSeconds);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('mousemove', ['$event'])
  @HostListener('touchstart', ['$event'])
  public mouseDownAndTouchStartHandler(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('window:mousemove')
  @HostListener('window:click')
  @HostListener('window:touchstart', ['$event'])
  public processWindowClick(): void {
    this.hoveredDate$.next(null);
  }

  private processSelectionModeChange(change: ComponentChange<this, DatePickerSelectionMode>): void {
    const updatedValue: DatePickerSelectionMode | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.selectionMode$.next(updatedValue);
  }

  private processPreviewModeChange(change: ComponentChange<this, DatePickerPreviewMode>): void {
    const updatedValue: DatePickerPreviewMode | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.previewMode$.next(updatedValue);
  }

  private processWithSecondsChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.withSeconds$.next(updatedValue);
  }

  private processSelectedDateChange(change: ComponentChange<this, Date>): void {
    const updatedValue: Date | undefined = change?.currentValue;

    if (isNil(updatedValue) || !isDate(updatedValue)) {
      return;
    }
    const sanitizedDate: Date = sanitizeDate(updatedValue);
    const sanitizedDateWithClearedTime: Date = dateClearTime(sanitizedDate);
    this.selectedDate$.next(sanitizedDateWithClearedTime);
    this.baseDate$.next(sanitizedDateWithClearedTime);
  }

  private processSelectedRangeChange(change: ComponentChange<this, Date[]>): void {
    const updatedValue: Date[] | undefined = change?.currentValue;

    const parsedArray: Date[] = String(updatedValue)
      .split(',')
      .map((arrayItem: string) => new Date(Date.parse(arrayItem)))
      .filter((rangeDate: Date) => isDate(rangeDate));
    if (!Array.isArray(parsedArray)) {
      return;
    }
    const sanitizedRange: Date[] = parsedArray
      .filter((rangeDate: Date) => isDate(rangeDate))
      .map((rangeDate: Date) => dateClearTime(rangeDate));
    if (Object.is(sanitizedRange.length, 0)) {
      return;
    }

    this.selectedRange$.next(sanitizedRange);
    this.baseDate$.next(sanitizedRange[0]);
  }

  private handleSelectedDateForEmitting(): Subscription {
    return this.isSelectionModeDate$
      .pipe(
        filterNotNil(),
        take(1),
        filterTruthy(),
        switchMap(() => this.selectedDate$),
        filterNotNil(),
        distinctUntilChanged(this.datePickerStateService.isSameDate)
      )
      .subscribe((selectedDate: Date) => this.date.emit(selectedDate));
  }

  private handleSelectedRangeForEmitting(): Subscription {
    return this.isSelectionModeDate$
      .pipe(
        filterNotNil(),
        take(1),
        filterFalsy(),
        switchMap(() => this.selectedRange$),
        filter(
          (selectedRangeDates: Date[]) =>
            Array.isArray(selectedRangeDates) && Object.is(selectedRangeDates.length, VALID_DATES_COUNT)
        ),
        map((range: [Date, Date]) => {
          const sortFunction = (dateA: Date, dateB: Date) => dateA.valueOf() - dateB.valueOf();
          return [...range].sort(sortFunction);
        }),
        distinctUntilChanged((previousValue: Date[], currentValue: Date[]) => isEqual(previousValue, currentValue))
      )
      .subscribe((selectedRange: [Date, Date]) => this.range.emit(selectedRange));
  }
}

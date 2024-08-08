import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChange, ComponentChanges, subscribeOutsideAngular } from '@bimeister/pupakit.common';
import { filterFalsy, filterNotNil, filterTruthy, isEqual, isNil } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, skip, switchMap } from 'rxjs/operators';
import { dateClearTime } from '../../../../declarations/functions/date-clear-time.function';
import { isDate } from '../../../../declarations/functions/is-date.function';
import { sanitizeDate } from '../../../../declarations/functions/sanitize-date.function';
import { DatePickerPreviewMode } from '../../../../declarations/types/date-picker-preview-mode.type';
import { DatePickerSelectionMode } from '../../../../declarations/types/date-picker-selection-mode.type';
import { DatePickerStateService } from '../../services/date-picker-state.service';

const VALID_DATES_COUNT: number = 2;
const DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME: Date = dateClearTime(new Date());

@Component({
  selector: 'pupa-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [DatePickerStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent implements OnChanges, OnInit, OnDestroy {
  public readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(DEFAULT_CURRENT_DATE_WITH_CLEARED_TIME);

  @Input() public selectionMode: DatePickerSelectionMode = 'range';
  private readonly selectionMode$: BehaviorSubject<DatePickerSelectionMode> =
    this.datePickerStateService.selectionMode$;

  @Input() public selectedDate: Date;
  public readonly selectedDate$: BehaviorSubject<Date> = this.datePickerStateService.selectedDate$;

  @Input() public selectedRange: Date[];
  public readonly selectedRange$: BehaviorSubject<Date[]> = this.datePickerStateService.selectedRange$;

  @Input() public previewMode: DatePickerPreviewMode;
  public readonly previewMode$: BehaviorSubject<DatePickerPreviewMode> = this.datePickerStateService.previewMode$;

  @Input() public withSeconds: boolean = false;
  public readonly withSeconds$: BehaviorSubject<boolean> = this.datePickerStateService.withSeconds$;

  @Input() public hours: number | null = null;
  public readonly hours$: BehaviorSubject<number | null> = this.datePickerStateService.hours$;

  @Input() public minutes: number | null = null;
  public readonly minutes$: BehaviorSubject<number | null> = this.datePickerStateService.minutes$;

  @Input() public seconds: number | null = null;
  public readonly seconds$: BehaviorSubject<number | null> = this.datePickerStateService.seconds$;

  @Input() public isBackDating: boolean = true;
  public readonly isBackDating$: BehaviorSubject<boolean> = this.datePickerStateService.isBackDating$;

  @Input() public availableEndDate: Date | number = Infinity;
  public readonly availableEndDate$: BehaviorSubject<Date | number> = this.datePickerStateService.availableEndDate$;

  @Input() public availableStartDate: Date | number = -Infinity;
  public readonly availableStartDate$: BehaviorSubject<Date | number> = this.datePickerStateService.availableStartDate$;

  @Input() public defaultTime: Date | null = null;

  @Output() public readonly date: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() public readonly range: EventEmitter<[Date, Date]> = new EventEmitter<[Date, Date]>();

  @Output() private readonly selectedHours: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedMinutes: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedSeconds: EventEmitter<number> = new EventEmitter<number>();

  public readonly isSelectionModeDate$: Observable<boolean> = this.datePickerStateService.isSelectionModeDate$;
  public readonly hoveredDate$: BehaviorSubject<Date> = this.datePickerStateService.hoveredDate$;

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly datePickerStateService: DatePickerStateService,
    private readonly ngZone: NgZone,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {
    this.subscription.add(this.handleSelectedDateForEmitting()).add(this.handleSelectedRangeForEmitting());
  }

  public ngOnInit(): void {
    this.subscription.add(this.handleWindowEvents());
    this.subscription.add(this.handleHostEvents());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processSelectionModeChange(changes?.selectionMode);
    this.processSelectedDateChange(changes?.selectedDate);
    this.processSelectedRangeChange(changes?.selectedRange);
    this.processPreviewModeChange(changes?.previewMode);
    this.processWithSecondsChange(changes?.withSeconds);
    this.processHoursChange(changes?.hours);
    this.processMinutesChange(changes?.minutes);
    this.processSecondsChange(changes?.seconds);
    this.processIsBackDatingChange(changes?.isBackDating);
    this.processAvailableEndDateChange(changes?.availableEndDate);
    this.processAvailableStartDateChange(changes?.availableStartDate);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processWindowClick(): void {
    this.hoveredDate$.next(null);
  }

  public selectHours(hour: number): void {
    this.selectedHours.emit(hour);
  }

  public selectMinutes(minute: number): void {
    this.selectedMinutes.emit(minute);
  }

  public selectSeconds(second: number): void {
    this.selectedSeconds.emit(second);
  }

  private handleWindowEvents(): Subscription {
    return merge(fromEvent(window, 'mousemove'), fromEvent(window, 'click'), fromEvent(window, 'touchstart'))
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe(() => this.processWindowClick());
  }

  private handleHostEvents(): Subscription {
    return merge(
      fromEvent(this.elementRef.nativeElement, 'mousedown'),
      fromEvent(this.elementRef.nativeElement, 'mousemove'),
      fromEvent(this.elementRef.nativeElement, 'touchstart')
    )
      .pipe(subscribeOutsideAngular(this.ngZone))
      .subscribe((event: Event) => event.stopPropagation());
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

  private processHoursChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.hours$.next(updatedValue);
  }

  private processMinutesChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.minutes$.next(updatedValue);
  }

  private processSecondsChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.seconds$.next(updatedValue);
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

  private processSelectedDateChange(change: ComponentChange<this, Date>): void {
    const updatedValue: Date | undefined = change?.currentValue;

    if (!isDate(updatedValue)) {
      this.selectedDate$.next(null);
      return;
    }

    const sanitizedDate: Date = sanitizeDate(updatedValue);
    const sanitizedDateWithClearedTime: Date = dateClearTime(sanitizedDate);
    this.selectedDate$.next(sanitizedDateWithClearedTime);
    this.baseDate$.next(sanitizedDateWithClearedTime);
  }

  private processSelectedRangeChange(change: ComponentChange<this, Date[]>): void {
    const updatedValue: Date[] | undefined = change?.currentValue;

    const isNullValues: boolean = updatedValue?.every((value: Date) => isNil(value));
    if (isNullValues) {
      this.selectedRange$.next([]);
      return;
    }

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
        filterTruthy(),
        switchMap(() => this.selectedDate$),
        // this.date should emit values on user selection only.
        // The first emitted value into this.selectedDate$ is BehaviorSubject's default value (null).
        // The second emitted value into this.selectedDate$ is current value from the pupa-input-date control.
        // Subsequent emitted values are those that the user has manually selected.
        skip(2),
        distinctUntilChanged(this.datePickerStateService.isSameDate),
        filterNotNil()
      )
      .subscribe((selectedDate: Date) => this.date.emit(selectedDate));
  }

  private handleSelectedRangeForEmitting(): Subscription {
    return this.isSelectionModeDate$
      .pipe(
        filterNotNil(),
        filterFalsy(),
        switchMap(() => this.selectedRange$),
        map((range: [Date, Date]) => {
          const sortFunction: (dateA: Date, dateB: Date) => number = (dateA: Date, dateB: Date) =>
            dateA.valueOf() - dateB.valueOf();
          return [...range].sort(sortFunction);
        }),
        distinctUntilChanged((previousValue: Date[], currentValue: Date[]) => isEqual(previousValue, currentValue)),
        filter(
          (selectedRangeDates: Date[]) =>
            Array.isArray(selectedRangeDates) && Object.is(selectedRangeDates.length, VALID_DATES_COUNT)
        )
      )
      .subscribe((selectedRange: [Date, Date]) => this.range.emit(selectedRange));
  }
}

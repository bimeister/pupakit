import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { isDate } from '@bimeister/pupakit.calendar';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { dateClearTime } from '../../../../declarations/functions/date-clear-time.function';
import { sanitizeDate } from '../../../../declarations/functions/sanitize-date.function';
import { DatePickerStateService } from '../../services/date-picker-state.service';

const DEFAULT_CURRENT_DATE: Date = dateClearTime(new Date());

@Component({
  selector: 'pupa-date-picker-simple-time',
  templateUrl: './date-picker-simple-time.component.html',
  styleUrls: ['./date-picker-simple-time.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerSimpleTimeComponent implements OnChanges {
  @Input() public baseDate: Date = DEFAULT_CURRENT_DATE;
  public readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(DEFAULT_CURRENT_DATE);

  @Input() public defaultTime: Date | null = null;

  public readonly hours$: BehaviorSubject<number | null> = this.datePickerStateService.hours$;
  public readonly minutes$: BehaviorSubject<number | null> = this.datePickerStateService.minutes$;
  public readonly seconds$: BehaviorSubject<number | null> = this.datePickerStateService.seconds$;

  @Output() private readonly selectedHours: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedMinutes: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedSeconds: EventEmitter<number> = new EventEmitter<number>();

  public readonly withSeconds$: BehaviorSubject<boolean> = this.datePickerStateService.withSeconds$;

  public readonly baseDateNextMont$: Observable<Date> = this.baseDate$.pipe(
    map((baseDate: Date) => {
      const currentMonth: number = baseDate.getMonth();
      const nextMonth: number = currentMonth + 1;
      const currentYear: number = baseDate.getFullYear();
      return dateClearTime(new Date(currentYear, nextMonth, 1));
    })
  );

  constructor(private readonly datePickerStateService: DatePickerStateService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processBaseDateChange(changes?.baseDate);
    this.processDefaultTimeChange(changes?.defaultTime);
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

  private processDefaultTimeChange(change: ComponentChange<this, Date>): void {
    const updatedValue: Date | undefined = change?.currentValue;

    if (isNil(updatedValue) || !isDate(updatedValue)) {
      return;
    }

    combineLatest([this.hours$, this.minutes$])
      .pipe(
        take(1),
        filter(([hours, minutes]: number[]) => (hours < 0 || isNil(hours)) && (minutes < 0 || isNil(minutes)))
      )
      .subscribe(() => {
        this.selectHours(updatedValue.getHours());
        this.selectMinutes(updatedValue.getMinutes());
      });
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
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { dateClearTime } from '../../../../../internal/helpers/date-clear-time.helper';
import { isDate } from '../../../../../internal/helpers/is-date.helper';
import { sanitizeDate } from '../../../../../internal/helpers/sanitize-date.helper';
import { DatePickerStateService } from '../../services/date-picker-state.service';

const DEFAULT_CURRENT_DATE: Date = dateClearTime(new Date());

@Component({
  selector: 'pupa-date-picker-simple-time',
  templateUrl: './date-picker-simple-time.component.html',
  styleUrls: ['./date-picker-simple-time.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerSimpleTimeComponent implements OnChanges {
  @Input() public baseDate: Date = DEFAULT_CURRENT_DATE;
  public readonly baseDate$: BehaviorSubject<Date> = new BehaviorSubject<Date>(DEFAULT_CURRENT_DATE);

  public readonly hours$: BehaviorSubject<number> = this.datePickerStateService.hours$;
  public readonly minutes$: BehaviorSubject<number> = this.datePickerStateService.minutes$;
  public readonly seconds$: BehaviorSubject<number> = this.datePickerStateService.seconds$;

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

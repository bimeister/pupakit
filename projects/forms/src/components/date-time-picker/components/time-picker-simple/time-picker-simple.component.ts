import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentChanges, ComponentChange } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { TimePickerStateService } from '../../services/time-picker-state.service';

@Component({
  selector: 'pupa-time-picker-simple',
  templateUrl: './time-picker-simple.component.html',
  styleUrls: ['./time-picker-simple.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerSimpleComponent implements OnChanges {
  @Input() public withSeconds: boolean = false;
  public readonly withSeconds$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public withGradient: boolean = false;
  public readonly withGradient$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() public chosenHours: number = null;
  public readonly chosenHours$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  @Input() public chosenMinutes: number = null;
  public readonly chosenMinutes$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  @Input() public chosenSeconds: number = null;
  public readonly chosenSeconds$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly hours: number[] = this.timePickerStateService.hours;
  public readonly minutes: number[] = this.timePickerStateService.minutes;
  public readonly seconds: number[] = this.timePickerStateService.seconds;

  @Output() private readonly selectedHours: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedMinutes: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedSeconds: EventEmitter<number> = new EventEmitter<number>();

  constructor(private readonly timePickerStateService: TimePickerStateService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processWithSecondsChange(changes?.withSeconds);
    this.processWithGradientChange(changes?.withGradient);

    this.processChosenHoursChange(changes?.chosenHours);
    this.processChosenMinutesChange(changes?.chosenMinutes);
    this.processChosenSecondsChange(changes?.chosenSeconds);
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

  private processWithSecondsChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.withSeconds$.next(updatedValue);
  }

  private processWithGradientChange(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.withGradient$.next(updatedValue);
  }

  private processChosenHoursChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.chosenHours$.next(updatedValue);
  }

  private processChosenMinutesChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.chosenMinutes$.next(updatedValue);
  }

  private processChosenSecondsChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }
    this.chosenSeconds$.next(updatedValue);
  }
}

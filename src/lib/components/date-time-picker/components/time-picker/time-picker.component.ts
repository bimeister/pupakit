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
import { BehaviorSubject } from 'rxjs';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TimePickerStateService } from '../../services/time-picker-state.service';

@Component({
  selector: 'pupa-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  providers: [TimePickerStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent implements OnChanges {
  @Input() public readonly withSeconds: boolean = false;
  public readonly withSeconds$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() private readonly selectedHours: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedMinutes: EventEmitter<number> = new EventEmitter<number>();
  @Output() private readonly selectedSeconds: EventEmitter<number> = new EventEmitter<number>();

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processWithSecondsChange(changes?.withSeconds);
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
}

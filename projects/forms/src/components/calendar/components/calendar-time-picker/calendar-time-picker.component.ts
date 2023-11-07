import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarTextKey } from '../../../../declarations/enums/calendar-text-key.enum';
import { isDate } from '../../../../declarations/functions/is-date.function';
import { CalendarTranslation } from '../../../../declarations/interfaces/calendar-translation.interface';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

@Component({
  selector: 'pupa-calendar-time-picker',
  templateUrl: './calendar-time-picker.component.html',
  styleUrls: ['./calendar-time-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarTimePickerComponent implements OnInit {
  @Input()
  public isRange: boolean = false;

  public readonly startTime: FormControl<Date | null> = new FormControl<Date | null>(new Date());
  public readonly finishTime: FormControl<Date | null> = new FormControl<Date | null>(new Date());

  public readonly timePickerHeader$: Observable<string> = this.calendarTranslationService.translation$.pipe(
    map((translation: CalendarTranslation) => translation.texts[CalendarTextKey.Time])
  );

  public readonly startEventTimeText$: Observable<string> = this.calendarTranslationService.translation$.pipe(
    map((translation: CalendarTranslation) => translation.texts[CalendarTextKey.StartEventTime])
  );

  public readonly finishEventTimeText$: Observable<string> = this.calendarTranslationService.translation$.pipe(
    map((translation: CalendarTranslation) => translation.texts[CalendarTextKey.FinishEventTime])
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly calendarStateService: CalendarStateService,
    private readonly calendarTranslationService: CalendarTranslationService
  ) {
    this.subscription.add(this.setStartTime());
    this.subscription.add(this.setFinishTime());
  }

  public ngOnInit(): void {
    this.initializeTime();
  }

  private initializeTime(): void {
    this.calendarStateService.setStartTime(new Date());
    this.calendarStateService.setFinishTime(new Date());
  }

  private setStartTime(): Subscription {
    return this.startTime.valueChanges.subscribe((time: Date) => {
      this.calendarStateService.setStartTime(isDate(time) ? time : null);
    });
  }

  private setFinishTime(): Subscription {
    return this.finishTime.valueChanges.subscribe((time: Date) => {
      this.calendarStateService.setFinishTime(isDate(time) ? time : null);
    });
  }
}

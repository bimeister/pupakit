import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MONTHS_IN_YEAR } from '../../declarations/constants/months-in-year.const';
import { CalendarTextKey } from '../../declarations/enums/calendar-text-key.enum';
import { MonthIndex } from '../../declarations/enums/month-index.enum';
import { getCurrentCalendarMonth } from '../../declarations/functions/get-current-calendar-month.function';
import { CalendarMonth } from '../../declarations/interfaces/calendar-month.interface';
import { CalendarTranslation } from '../../declarations/interfaces/calendar-translation.interface';
import { CalendarConfigService } from '../../services/calendar-config.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

interface ItemToRender {
  year: number;
  months: number[];
}

const DIVIDER_HEIGHT_PX: number = 12;
const YEAR_LABEL_HEIGHT_PX: number = 16;
const YEAR_TABLE_HEIGHT_PX: number = 188;

@Component({
  selector: 'pupa-calendar-month-selector',
  templateUrl: './calendar-month-selector.component.html',
  styleUrls: ['./calendar-month-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthSelectorComponent implements AfterViewInit {
  @Output() public selected: EventEmitter<CalendarMonth> = new EventEmitter<CalendarMonth>();

  @ViewChild(CdkVirtualScrollViewport)
  private readonly virtualScrollViewport: CdkVirtualScrollViewport;

  public readonly headerTitle$: Observable<string> = this.calendarTranslationService.translation$.pipe(
    map((translation: CalendarTranslation) => translation.texts[CalendarTextKey.SelectMonth])
  );

  public readonly itemHeight: number = DIVIDER_HEIGHT_PX * 2 + YEAR_LABEL_HEIGHT_PX + YEAR_TABLE_HEIGHT_PX;

  private readonly startYear: number = this.calendarConfigService.startYear;

  public currentYearInScroll$: Observable<number>;

  public readonly items: ItemToRender[] = Array.from({
    length: this.calendarConfigService.yearsRange,
  }).map((_: unknown, yearIndex: number) => ({
    year: this.startYear + yearIndex,
    months: Array.from({ length: MONTHS_IN_YEAR }).map((__: unknown, monthIndex: MonthIndex) => monthIndex),
  }));

  public readonly monthNameByIndex$: Observable<Record<MonthIndex, string>> =
    this.calendarTranslationService.translation$.pipe(map((translation: CalendarTranslation) => translation.months));

  public readonly currentCalendarMonth: CalendarMonth = getCurrentCalendarMonth();

  constructor(
    private readonly calendarTranslationService: CalendarTranslationService,
    private readonly calendarConfigService: CalendarConfigService
  ) {}

  public ngAfterViewInit(): void {
    this.currentYearInScroll$ = this.getCurrentYearInScroll();
    this.scrollToCurrentYear();
  }

  public getCurrentYearInScroll(): Observable<number> {
    if (isNil(this.virtualScrollViewport)) {
      throw new Error('[CalendarMonthSelectorComponent] virtualScrollViewport is not provided');
    }

    return this.virtualScrollViewport.scrolledIndexChange.pipe(map((index: number) => index + this.startYear));
  }

  public selectMonth(year: number, month: number): void {
    this.selected.emit({
      year,
      month,
    });
  }

  private scrollToCurrentYear(): void {
    if (isNil(this.virtualScrollViewport)) {
      return;
    }

    const currentYearIndex: number = new Date().getFullYear() - this.startYear;

    requestAnimationFrame(() => {
      this.virtualScrollViewport.scrollToIndex(currentYearIndex, 'auto');
    });
  }
}

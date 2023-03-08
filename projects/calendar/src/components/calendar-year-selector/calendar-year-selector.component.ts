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
import { CalendarTextKey } from '../../declarations/enums/calendar-text-key.enum';
import { CalendarTranslation } from '../../declarations/interfaces/calendar-translation.interface';
import { CalendarConfigService } from '../../services/calendar-config.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

const YEARS_IN_ROW: number = 3;

@Component({
  selector: 'pupa-calendar-year-selector',
  templateUrl: './calendar-year-selector.component.html',
  styleUrls: ['./calendar-year-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarYearSelectorComponent implements AfterViewInit {
  @Output()
  public readonly selected: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(CdkVirtualScrollViewport)
  private readonly virtualScrollViewport: CdkVirtualScrollViewport;

  public readonly headerTitle$: Observable<string> = this.calendarTranslationService.translation$.pipe(
    map((translation: CalendarTranslation) => translation.texts[CalendarTextKey.SelectYear])
  );

  public readonly rowHeight: number = 40;

  private readonly startYear: number = this.calendarConfigService.startYear;
  private readonly endYear: number = this.calendarConfigService.endYear;

  public readonly currentYear: number = new Date().getFullYear();

  public readonly yearsTable: number[][] = Array.from({
    length: Math.ceil(this.calendarConfigService.yearsRange / YEARS_IN_ROW),
  }).map((_: unknown, rowIndex: number) =>
    Array.from({
      length: YEARS_IN_ROW,
    })
      .map((__: unknown, colIndex: number) => this.startYear + rowIndex * YEARS_IN_ROW + colIndex)
      .filter((year: number) => year < this.endYear)
  );

  constructor(
    private readonly calendarTranslationService: CalendarTranslationService,
    private readonly calendarConfigService: CalendarConfigService
  ) {}

  public ngAfterViewInit(): void {
    this.scrollToCurrentYear();
  }

  public selectYear(year: number): void {
    this.selected.emit(year);
  }

  private scrollToCurrentYear(): void {
    if (isNil(this.virtualScrollViewport)) {
      return;
    }

    const currentYearIndex: number = Math.floor((this.currentYear - this.startYear) / YEARS_IN_ROW);

    requestAnimationFrame(() => {
      this.virtualScrollViewport.scrollToIndex(currentYearIndex, 'auto');
    });
  }
}

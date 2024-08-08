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
import { CalendarTextKey } from '../../../../declarations/enums/calendar-text-key.enum';
import { CalendarTranslation } from '../../../../declarations/interfaces/calendar-translation.interface';
import { CalendarConfigService } from '../../services/calendar-config.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';

const YEARS_IN_ROW: number = 3;
const ROW_HEIGHT_REM: number = 12;

function createYearsTable(startYear: number, endYear: number): number[][] {
  return Array.from({
    length: Math.ceil((endYear - startYear) / YEARS_IN_ROW),
  }).map((_: unknown, rowIndex: number) =>
    Array.from({
      length: YEARS_IN_ROW,
    })
      .map((__: unknown, colIndex: number) => startYear + rowIndex * YEARS_IN_ROW + colIndex)
      .filter((year: number) => year < endYear)
  );
}

@Component({
  selector: 'pupa-calendar-year-selector',
  templateUrl: './calendar-year-selector.component.html',
  styleUrls: ['./calendar-year-selector.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarYearSelectorComponent implements AfterViewInit {
  @Output()
  public readonly select: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild(CdkVirtualScrollViewport)
  private readonly virtualScrollViewport: CdkVirtualScrollViewport;

  public readonly headerTitle$: Observable<string> = this.calendarTranslationService.translation$.pipe(
    map((translation: CalendarTranslation) => translation.texts[CalendarTextKey.SelectYear])
  );

  public readonly rowHeightPx$: Observable<number> = this.clientUiStateHandlerService.remSizePx$.pipe(
    map((remSizePx: number) => remSizePx * ROW_HEIGHT_REM)
  );

  public readonly currentYear: number = new Date().getFullYear();

  private readonly startYear: number = this.calendarConfigService.startYear;
  private readonly endYear: number = this.calendarConfigService.endYear;

  public readonly yearsTable: number[][] = createYearsTable(this.startYear, this.endYear);

  constructor(
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly calendarTranslationService: CalendarTranslationService,
    private readonly calendarConfigService: CalendarConfigService
  ) {}

  public ngAfterViewInit(): void {
    this.scrollToCurrentYear();
  }

  public selectYear(year: number): void {
    this.select.emit(year);
  }

  private scrollToCurrentYear(): void {
    if (isNil(this.virtualScrollViewport)) {
      return;
    }

    const currentYearIndex: number = Math.floor((this.currentYear - this.startYear) / YEARS_IN_ROW);

    requestAnimationFrame(() => {
      this.virtualScrollViewport.scrollToIndex(currentYearIndex);
    });
  }
}

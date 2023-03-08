import { Inject, Injectable, Optional } from '@angular/core';
import { isEmpty, isNil } from '@bimeister/utilities';
import { DEFAULT_CALENDAR_TRANSLATIONS } from '../declarations/constants/default-calendar-translations.const';
import { DEFAULT_CALENDAR_YEARS_RANGE } from '../declarations/constants/default-calendar-years-range.const';
import { SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS } from '../declarations/constants/small-calendar-cycle-size-in-years.const';
import { CALENDAR_CONFIG_TOKEN } from '../declarations/constants/tokens/calendar-config.token';
import { DayOfWeek } from '../declarations/enums/day-of-week.enum';
import { CalendarConfig } from '../declarations/interfaces/calendar-config.interface';
import { CalendarTranslation } from '../declarations/interfaces/calendar-translation.interface';
import { CalendarVirtualScrollConfig } from '../declarations/interfaces/calendar-virtual-scroll-config.interface';

const LABEL_HEIGHT_PX: number = 16;
const DIVIDER_HEIGHT_PX: number = 16;
const WEEK_HEIGHT_PX: number = 36;
const BUFFER_PX: number = 500;

@Injectable()
export class CalendarConfigService {
  public readonly startWeekday: DayOfWeek;

  public readonly startYear: number;

  public readonly endYear: number;

  public readonly translations: Record<string, CalendarTranslation>;

  public readonly yearsRange: number;

  public get virtualScrollConfig(): CalendarVirtualScrollConfig {
    return {
      bufferPx: BUFFER_PX,
      yearsRange: this.yearsRange,
      labelHeightPx: LABEL_HEIGHT_PX,
      dividerHeightPx: DIVIDER_HEIGHT_PX,
      weekHeightPx: WEEK_HEIGHT_PX,
      startWeekday: this.startWeekday,
      startYear: this.startYear,
    };
  }

  constructor(@Optional() @Inject(CALENDAR_CONFIG_TOKEN) config: Partial<CalendarConfig>) {
    this.startWeekday = config?.startWeekday ?? DayOfWeek.Monday;

    this.startYear = config?.startYear ?? CalendarConfigService.getDefaultStartYear();

    CalendarConfigService.validateYearsRange(config?.yearsRange);

    this.yearsRange = config?.yearsRange ?? CalendarConfigService.getDefaultEndYear() - this.startYear;

    this.endYear = this.startYear + this.yearsRange;

    this.translations = !isEmpty(config?.translations) ? config.translations : DEFAULT_CALENDAR_TRANSLATIONS;
  }

  private static getDefaultStartYear(): number {
    return new Date().getFullYear() - Math.floor(DEFAULT_CALENDAR_YEARS_RANGE / 2);
  }

  private static getDefaultEndYear(): number {
    return new Date().getFullYear() + Math.floor(DEFAULT_CALENDAR_YEARS_RANGE / 2);
  }

  private static validateYearsRange(yearsRange: number | undefined): void {
    const isValid: boolean = isNil(yearsRange) || yearsRange % SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS === 0;

    if (isValid) {
      return;
    }

    throw new Error(`[CalendarConfigService] 'yearsRange' must be a multiple of ${SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS}`);
  }
}

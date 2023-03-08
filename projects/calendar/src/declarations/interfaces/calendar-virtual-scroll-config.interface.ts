import { DayOfWeek } from '../enums/day-of-week.enum';

export interface CalendarVirtualScrollConfig {
  bufferPx: number;
  // cycleMonthsHeights: readonly (readonly number[])[];
  yearsRange: number;
  labelHeightPx: number;
  dividerHeightPx: number;
  weekHeightPx: number;
  startWeekday: DayOfWeek;
  startYear: number;
}

import { BaseCalendarConfig } from './base-calendar-config.interface';

export interface CalendarConfig extends BaseCalendarConfig {
  readonly startYear: number;
}

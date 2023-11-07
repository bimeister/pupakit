import { InjectionToken } from '@angular/core';
import { CalendarConfig } from '../../interfaces/calendar-config.interface';

export const CALENDAR_CONFIG_TOKEN: InjectionToken<Partial<CalendarConfig>> = new InjectionToken<
  Partial<CalendarConfig>
>('CALENDAR_CONFIG_TOKEN');

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DAYS_OF_WEEK } from '@kit/lib/components/day-selector/constants/days-of-week.const';
import { DaySelectorItem } from '@kit/lib/components/day-selector/types/day-selector-item';
import { DEFAULT_LOCALE } from '@kit/lib/components/day-selector/constants/default-locale.const';

@Injectable()
export class LocaleDayFormatterService {
  private currentLocale: string = DEFAULT_LOCALE;

  public localeDaysOfWeek$: BehaviorSubject<DaySelectorItem[]> = new BehaviorSubject<DaySelectorItem[]>(
    LocaleDayFormatterService.getLocaleDaysOfWeek(this.currentLocale)
  );

  public set locale(locale: string) {
    if (locale === DEFAULT_LOCALE && this.currentLocale === DEFAULT_LOCALE) return;

    this.currentLocale = locale;
    this.localeDaysOfWeek$.next(LocaleDayFormatterService.getLocaleDaysOfWeek(this.currentLocale));
  }

  private static getLocaleDaysOfWeek(locale: string): DaySelectorItem[] {
    const datesOfWeek: Date[] = LocaleDayFormatterService.generateWeekDates();

    const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
    });

    return datesOfWeek.map((date: Date, idx: number) => ({
      value: DAYS_OF_WEEK[idx],
      localeName: dateFormatter.format(date),
    }));
  }

  private static generateWeekDates(): Date[] {
    const startOfWeek: number = 11;
    const monday: Date = new Date(2022, 3, startOfWeek);

    let countOfDays: number = 0;
    const daysAWeek: number = 7;

    const dates: Date[] = [monday];

    while (countOfDays < daysAWeek - 1) {
      countOfDays++;
      dates.push(new Date(2022, 3, startOfWeek + countOfDays));
    }

    return dates;
  }
}

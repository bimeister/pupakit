import { Inject, Injectable, Optional } from '@angular/core';
import { DEFAULT_LOCALE } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_DAY_SELECTOR_CONFIG } from '../../../declarations/constants/default-day-selector-config.const';
import { DayOfWeek } from '../../../declarations/enums/day-of-week.enum';
import { DaySelectorConfig } from '../../../declarations/interfaces/day-selector-config.interface';
import { DAY_SELECTOR_CONFIG_TOKEN } from '../../../declarations/tokens/day-selector-config.token';

@Injectable()
export class LocaleDayFormatterService {
  private readonly translates: Record<string, Record<DayOfWeek, string>>;

  private readonly currentLocale$: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_LOCALE);

  public readonly localeNames$: Observable<Record<DayOfWeek, string>> = this.currentLocale$.pipe(
    map((locale: string) => this.translates[locale])
  );

  constructor(@Optional() @Inject(DAY_SELECTOR_CONFIG_TOKEN) daySelectorConfig?: DaySelectorConfig) {
    const config: DaySelectorConfig = !isNil(daySelectorConfig) ? daySelectorConfig : DEFAULT_DAY_SELECTOR_CONFIG;
    this.translates = config.translates;
  }

  public set locale(value: string) {
    if (isNil(this.translates[value])) throw new Error('No translates for current locale');

    this.currentLocale$.next(value);
  }
}

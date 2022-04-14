import { Inject, Injectable, Optional } from '@angular/core';
import { DayOfWeek } from '../types/day-of-week';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_LOCALE } from '../constants/default-locale.const';
import { LocaleDayNames } from '../types/locale-day-names';
import { DAY_SELECTOR_CONFIG_TOKEN } from '../../../../internal/constants/tokens/day-selector-config.token';
import { DaySelectorConfig } from '../../../../internal/declarations/interfaces/day-selector-config.interface';
import { DEFAULT_DAY_SELECTOR_CONFIG } from '../constants/default-day-selector-config.const';

@Injectable()
export class LocaleDayFormatterService {
  private readonly translates: Record<string, Record<DayOfWeek, string>>;

  private readonly currentLocale$: BehaviorSubject<string> = new BehaviorSubject<string>(DEFAULT_LOCALE);

  public readonly localeNames$: Observable<LocaleDayNames> = this.currentLocale$.pipe(
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

import { Injectable } from '@angular/core';
import { LocaleService } from '@bimeister/pupakit.common';
import { filterNotEmpty } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CalendarTranslation } from '../declarations/interfaces/calendar-translation.interface';
import { CalendarConfigService } from './calendar-config.service';

const DEFAULT_LOCALE: string = 'en';

@Injectable()
export class CalendarTranslationService {
  private readonly locale$: Observable<string> = this.localeService.locale$.pipe(startWith(DEFAULT_LOCALE));

  public readonly translation$: Observable<CalendarTranslation> = this.locale$.pipe(
    map((locale: string) => this.getTranslationByLocale(locale)),
    filterNotEmpty()
  );

  constructor(
    private readonly calendarConfigService: CalendarConfigService,
    private readonly localeService: LocaleService<string>
  ) {}

  private getTranslationByLocale(locale: string): CalendarTranslation | null {
    return this.calendarConfigService.translations?.[locale] ?? null;
  }
}

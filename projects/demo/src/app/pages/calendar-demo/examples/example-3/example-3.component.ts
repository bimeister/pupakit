import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { LocaleService } from '@bimeister/pupakit.common';
import {
  CALENDAR_CONFIG_TOKEN,
  CalendarConfig,
  CalendarTextKey,
  DayOfWeek,
  MonthIndex,
} from '@bimeister/pupakit.forms';

const CALENDAR_CONFIG: Partial<CalendarConfig> = {
  startWeekday: DayOfWeek.Sunday,
  startYear: 2020,
  yearsRange: 28,
  translations: {
    en: {
      weekdays: {
        [DayOfWeek.Sunday]: 'Di.',
        [DayOfWeek.Monday]: 'Lu.',
        [DayOfWeek.Tuesday]: 'Ma.',
        [DayOfWeek.Wednesday]: 'Me.',
        [DayOfWeek.Thursday]: 'Je.',
        [DayOfWeek.Friday]: 'Ve.',
        [DayOfWeek.Saturday]: 'Sa.',
      },
      months: {
        [MonthIndex.January]: 'Janvier',
        [MonthIndex.February]: 'Février',
        [MonthIndex.March]: 'Mars',
        [MonthIndex.April]: 'Avril',
        [MonthIndex.May]: 'Mai',
        [MonthIndex.June]: 'Juin',
        [MonthIndex.July]: 'Juillet',
        [MonthIndex.August]: 'Août',
        [MonthIndex.September]: 'Septembre',
        [MonthIndex.October]: 'Octobre',
        [MonthIndex.November]: 'Novembre',
        [MonthIndex.December]: 'Décembre',
      },
      texts: {
        [CalendarTextKey.SelectYear]: `Sélectionner l'année`,
        [CalendarTextKey.SelectMonth]: `Sélectionnez un mois`,
        [CalendarTextKey.Time]: 'Temps',
        [CalendarTextKey.StartEventTime]: `Heure de début de l'événement`,
        [CalendarTextKey.FinishEventTime]: `Heure de fin de l'événement`,
      },
    },
  },
};

@Component({
  selector: 'demo-calendar-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CALENDAR_CONFIG_TOKEN,
      useValue: CALENDAR_CONFIG,
    },
    LocaleService,
  ],
})
export class Example3Component {
  constructor(private readonly localeService: LocaleService) {
    this.localeService.setLocale('fr');
  }
}

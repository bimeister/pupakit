import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DayOfWeek, DaySelectorSize, DAY_SELECTOR_CONFIG_TOKEN } from '@bimeister/pupakit.forms';

const BASE_SRC: string = 'day-selector-demo/examples';

@Component({
  selector: 'demo-select',
  styleUrls: ['./day-selector-demo.component.scss'],
  templateUrl: './day-selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DAY_SELECTOR_CONFIG_TOKEN,
      useValue: {
        translates: {
          en: {
            [DayOfWeek.Monday]: 'Mo',
            [DayOfWeek.Tuesday]: 'Tu',
            [DayOfWeek.Wednesday]: 'We',
            [DayOfWeek.Thursday]: 'Th',
            [DayOfWeek.Friday]: 'Fr',
            [DayOfWeek.Saturday]: 'Sa',
            [DayOfWeek.Sunday]: 'Su',
          },
          fr: {
            [DayOfWeek.Monday]: 'Lu.',
            [DayOfWeek.Tuesday]: 'Ma.',
            [DayOfWeek.Wednesday]: 'Me.',
            [DayOfWeek.Thursday]: 'Je.',
            [DayOfWeek.Friday]: 'Ve.',
            [DayOfWeek.Saturday]: 'Sa.',
            [DayOfWeek.Sunday]: 'Di.',
          },
          ru: {
            [DayOfWeek.Monday]: 'Пн',
            [DayOfWeek.Tuesday]: 'Вт',
            [DayOfWeek.Wednesday]: 'Ср',
            [DayOfWeek.Thursday]: 'Чт',
            [DayOfWeek.Friday]: 'Пт',
            [DayOfWeek.Saturday]: 'Сб',
            [DayOfWeek.Sunday]: 'Вс',
          },
        },
      },
    },
  ],
})
export class DaySelectorDemoComponent {
  public readonly formControl: FormControl = new FormControl([]);
  public readonly size: FormControl = new FormControl('large');
  public readonly locale: FormControl = new FormControl('en');

  public readonly selectorSizes: DaySelectorSize[] = ['small', 'medium', 'large'];
  public readonly selectorLocales: string[] = ['en', 'fr', 'ru'];

  public plainDemoDaySelectorExample: Record<string, string> = {
    HTML: `${BASE_SRC}/demo-plain-day-selector-example/demo-plain-day-selector-example.component.html`,
    TS: `${BASE_SRC}/demo-plain-day-selector-example/demo-plain-day-selector-example.component.ts`,
  };

  public itemSizeDaySelectorExample: Record<string, string> = {
    HTML: `${BASE_SRC}/demo-item-size-day-selector-example/demo-item-size-day-selector-example.component.html`,
    TS: `${BASE_SRC}/demo-item-size-day-selector-example/demo-item-size-day-selector-example.component.ts`,
  };

  public localeDaySelectorExample: Record<string, string> = {
    HTML: `${BASE_SRC}/demo-locale-day-selector-example/demo-locale-day-selector-example.component.html`,
    TS: `${BASE_SRC}/demo-locale-day-selector-example/demo-locale-day-selector-example.component.ts`,
  };
}

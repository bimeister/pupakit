import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DAY_SELECTOR_CONFIG_TOKEN } from '@kit/internal/constants/tokens/day-selector-config.token';

@Component({
  selector: 'demo-locale-day-selector-example',
  templateUrl: './demo-locale-day-selector-example.component.html',
  styleUrls: ['./demo-locale-day-selector-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DAY_SELECTOR_CONFIG_TOKEN,
      useValue: {
        translates: {
          en: {
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
            sun: 'Sun',
          },
          fr: {
            mon: 'Lu.',
            tue: 'Ma.',
            wed: 'Me.',
            thu: 'Je.',
            fri: 'Ve.',
            sat: 'Sa.',
            sun: 'Di.',
          },
        },
      },
    },
  ],
})
export class DemoLocaleDaySelectorExampleComponent {
  public readonly formControl: FormControl = new FormControl([]);
}

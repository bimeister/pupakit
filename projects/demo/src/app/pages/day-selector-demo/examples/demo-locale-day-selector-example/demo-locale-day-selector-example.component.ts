import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DAY_SELECTOR_CONFIG_TOKEN } from '@kit/internal/constants/tokens/day-selector-config.token';
import { DayOfWeek } from '@kit/internal/declarations/enums/day-of-week.enum';

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
          fr: {
            [DayOfWeek.Monday]: 'Lu.',
            [DayOfWeek.Tuesday]: 'Ma.',
            [DayOfWeek.Wednesday]: 'Me.',
            [DayOfWeek.Thursday]: 'Je.',
            [DayOfWeek.Friday]: 'Ve.',
            [DayOfWeek.Saturday]: 'Sa.',
            [DayOfWeek.Sunday]: 'Di.',
          },
        },
      },
    },
  ],
})
export class DemoLocaleDaySelectorExampleComponent {
  public readonly formControl: FormControl = new FormControl([]);
}

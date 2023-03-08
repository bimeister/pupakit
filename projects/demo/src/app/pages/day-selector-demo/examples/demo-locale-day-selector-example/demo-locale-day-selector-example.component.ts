import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DayOfWeek } from '@bimeister/pupakit.calendar';
import { DAY_SELECTOR_CONFIG_TOKEN } from '@bimeister/pupakit.forms';

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

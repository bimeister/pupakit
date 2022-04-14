import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

const BASE_SRC: string = 'day-selector-demo/examples';

@Component({
  selector: 'demo-select',
  styleUrls: ['./day-selector-demo.component.scss'],
  templateUrl: './day-selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaySelectorDemoComponent {
  public readonly formControl: FormControl = new FormControl([]);
  public readonly size: FormControl = new FormControl('medium');

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

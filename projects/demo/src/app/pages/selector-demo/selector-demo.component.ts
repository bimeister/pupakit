import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const BASE_SRC: string = 'selector-demo/examples';

@Component({
  selector: 'demo-select',
  styleUrls: ['./selector-demo.component.scss'],
  templateUrl: './selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorDemoComponent {
  public readonly formControl: FormControl = new FormControl([]);
  public readonly locale: FormControl = new FormControl('en-US');
  public readonly size: FormControl = new FormControl('medium');

  public readonly localeValue$: Observable<string> = this.locale.valueChanges.pipe(debounceTime(1000));

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

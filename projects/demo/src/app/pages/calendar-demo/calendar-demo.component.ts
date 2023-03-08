import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { isNil } from '@bimeister/utilities';

const BASE_REQUEST_PATH: string = 'calendar-demo/examples';

function getExampleContent(name: string): Record<string, string> {
  return {
    HTML: `${BASE_REQUEST_PATH}/${name}/${name}.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/${name}/${name}.component.scss`,
    TS: `${BASE_REQUEST_PATH}/${name}/${name}.component.ts`,
  };
}

@Component({
  selector: 'demo-calendar-demo',
  templateUrl: './calendar-demo.component.html',
  styleUrls: ['./calendar-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDemoComponent {
  public readonly example1Content: Record<string, string> = getExampleContent('example-1');
  public readonly example2Content: Record<string, string> = getExampleContent('example-2');
  public readonly example3Content: Record<string, string> = getExampleContent('example-3');

  public readonly dateFormControl: FormControl<Date | Date[]> = new FormControl<Date | Date[]>(new Date());

  public handleSelect([first, second]: Date[]): void {
    if (isNil(second)) {
      this.dateFormControl.setValue(first);
    }

    this.dateFormControl.setValue([first, second]);
  }
}

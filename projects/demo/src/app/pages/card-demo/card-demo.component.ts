import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const BASE_REQUEST_PATH: string = 'card-demo/examples';

@Component({
  selector: 'demo-card',
  templateUrl: './card-demo.component.html',
  styleUrls: ['./card-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDemoComponent {
  public readonly tabIndexFormControl: FormControl = new FormControl(0);

  public readonly maxRowsFormControl: FormControl = new FormControl(1);

  public readonly maxRows$: Observable<number | 'auto'> = this.maxRowsFormControl.valueChanges.pipe(
    map((value: string) => {
      const trimmedValue: string = value.trim();

      if (trimmedValue === 'auto') {
        return trimmedValue;
      }

      return parseInt(trimmedValue, 10);
    })
  );

  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'large',
      value: 'large',
      isDefault: true,
    },
    {
      caption: 'medium',
      value: 'medium',
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-1/example-1.component.ts`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-2/example-2.component.ts`,
  };

  public readonly example3Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-3/example-3.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-3/example-3.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-3/example-3.component.ts`,
  };

  public readonly example4Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-4/example-4.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-4/example-4.component.scss`,
    TS: `${BASE_REQUEST_PATH}/example-4/example-4.component.ts`,
  };
}

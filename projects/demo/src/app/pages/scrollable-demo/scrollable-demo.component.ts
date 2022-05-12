import { Component } from '@angular/core';
import { ScrollbarType } from '@kit/internal/api';
import { BehaviorSubject } from 'rxjs';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'scrollable-demo/examples';

@Component({
  selector: 'demo-scrollable-demo',
  templateUrl: './scrollable-demo.component.html',
  styleUrls: ['./scrollable-demo.component.scss'],
})
export class ScrollableDemoComponent {
  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Small',
      value: 'small',
    },
  ];
  public readonly positionOptions: PropsOption[] = [
    {
      caption: 'Internal',
      value: 'internal',
    },
    {
      caption: 'External',
      value: 'external',
    },
  ];
  public readonly scrollDragModeOptions: PropsOption[] = [
    {
      caption: 'None',
      value: 'null',
      isDefault: true,
    },
    {
      caption: 'Vertical',
      value: 'vertical',
    },
    {
      caption: 'Horizontal',
      value: 'horizontal',
    },
    {
      caption: 'All',
      value: 'all',
    },
  ];
  public readonly invisibleScrollbarsOptions: PropsOption[] = [
    {
      caption: 'Vertical',
      value: 'vertical',
    },
    {
      caption: 'Horizontal',
      value: 'horizontal',
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

  public readonly invisibleScrollbarsObs$: BehaviorSubject<ScrollbarType[]> = new BehaviorSubject([]);

  constructor() {
    setTimeout(() => this.invisibleScrollbarsObs$.next(['horizontal']), 3000);
    setTimeout(() => this.invisibleScrollbarsObs$.next(['vertical']), 6000);
    setTimeout(() => this.invisibleScrollbarsObs$.next(['horizontal', 'vertical']), 9000);
    setTimeout(() => this.invisibleScrollbarsObs$.next([]), 12000);
  }
}

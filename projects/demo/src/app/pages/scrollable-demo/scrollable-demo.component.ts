import { Component } from '@angular/core';
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

  public onScrollTopChanged(event: number): void {
    console.log(event);
  }

  public onScrollLeftChanged(event: number): void {
    console.log(event);
  }

  public onVerticalScrollVisibilityChanged(event: boolean): void {
    console.log(event);
  }

  public onHorizontalScrollVisibilityChanged(event: boolean): void {
    console.log(event);
  }

  public onScrolledToHorizontalStart(event: boolean): void {
    console.log(event);
  }

  public onScrolledToHorizontalEnd(event: boolean): void {
    console.log(event);
  }

  public onScrolledToVerticalStart(event: boolean): void {
    console.log(event);
  }

  public onScrolledToVerticalEnd(event: boolean): void {
    console.log(event);
  }

  public onContentDragStart(event: void): void {
    console.log(event);
  }

  public onContentDragEnd(event: void): void {
    console.log(event);
  }
}

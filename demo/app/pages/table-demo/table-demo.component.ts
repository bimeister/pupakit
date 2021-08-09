import { Component } from '@angular/core';

import { default as example1Html } from '!!raw-loader!./examples/example-1/example-1.component.html';
import { default as example1Scss } from '!!raw-loader!./examples/example-1/example-1.component.scss';
import { default as example1Ts } from '!!raw-loader!./examples/example-1/example-1.component.ts';

import { default as example2Html } from '!!raw-loader!./examples/example-2/example-2.component.html';
import { default as example2Scss } from '!!raw-loader!./examples/example-2/example-2.component.scss';
import { default as example2Ts } from '!!raw-loader!./examples/example-2/example-2.component.ts';

import { default as example3Html } from '!!raw-loader!./examples/example-3/example-3.component.html';
import { default as example3Scss } from '!!raw-loader!./examples/example-3/example-3.component.scss';
import { default as example3Ts } from '!!raw-loader!./examples/example-3/example-3.component.ts';

import { default as example4Html } from '!!raw-loader!./examples/example-4/example-4.component.html';
import { default as example4Scss } from '!!raw-loader!./examples/example-4/example-4.component.scss';
import { default as example4Ts } from '!!raw-loader!./examples/example-4/example-4.component.ts';

import { default as example5Html } from '!!raw-loader!./examples/example-5/example-5.component.html';
import { default as example5Scss } from '!!raw-loader!./examples/example-5/example-5.component.scss';
import { default as example5Ts } from '!!raw-loader!./examples/example-5/example-5.component.ts';

import { default as example6Html } from '!!raw-loader!./examples/example-6/example-6.component.html';
import { default as example6Scss } from '!!raw-loader!./examples/example-6/example-6.component.scss';
import { default as example6Ts } from '!!raw-loader!./examples/example-6/example-6.component.ts';

import { default as example7Html } from '!!raw-loader!./examples/example-7/example-7.component.html';
import { default as example7Scss } from '!!raw-loader!./examples/example-7/example-7.component.scss';
import { default as example7Ts } from '!!raw-loader!./examples/example-7/example-7.component.ts';

@Component({
  selector: 'demo-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss']
})
export class TableDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: example1Html,
    SCSS: example1Scss,
    TS: example1Ts
  };

  public readonly example2Content: Record<string, string> = {
    HTML: example2Html,
    SCSS: example2Scss,
    TS: example2Ts
  };

  public readonly example3Content: Record<string, string> = {
    HTML: example3Html,
    SCSS: example3Scss,
    TS: example3Ts
  };

  public readonly example4Content: Record<string, string> = {
    HTML: example4Html,
    SCSS: example4Scss,
    TS: example4Ts
  };

  public readonly example5Content: Record<string, string> = {
    HTML: example5Html,
    SCSS: example5Scss,
    TS: example5Ts
  };

  public readonly example6Content: Record<string, string> = {
    HTML: example6Html,
    SCSS: example6Scss,
    TS: example6Ts
  };

  public readonly example7Content: Record<string, string> = {
    HTML: example7Html,
    SCSS: example7Scss,
    TS: example7Ts
  };
}

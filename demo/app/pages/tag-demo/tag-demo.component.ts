import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

import { default as example1Html } from '!!raw-loader!./examples/example-1/example-1.component.html';
import { default as example1Scss } from '!!raw-loader!./examples/example-1/example-1.component.scss';
import { default as example1Ts } from '!!raw-loader!./examples/example-1/example-1.component.ts';

import { default as example2Html } from '!!raw-loader!./examples/example-2/example-2.component.html';
import { default as example2Scss } from '!!raw-loader!./examples/example-2/example-2.component.scss';
import { default as example2Ts } from '!!raw-loader!./examples/example-2/example-2.component.ts';

@Component({
  selector: 'pupa-tag-demo',
  templateUrl: './tag-demo.component.html',
  styleUrls: ['./tag-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagDemoComponent {
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
}

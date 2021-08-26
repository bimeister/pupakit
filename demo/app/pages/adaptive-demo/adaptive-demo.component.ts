import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { default as example1Scss } from '!!raw-loader!./examples/example-1/example-1.component.scss';
import { default as example1Html } from '!!raw-loader!./examples/example-1/example-1.component.html';

import { default as example2Scss } from '!!raw-loader!./examples/example-2/example-2.component.scss';
import { default as example2Html } from '!!raw-loader!./examples/example-2/example-2.component.html';

import { default as example3Scss } from '!!raw-loader!./examples/example-3/example-3.component.scss';
import { default as example3Html } from '!!raw-loader!./examples/example-3/example-3.component.html';

import { default as example4Scss } from '!!raw-loader!./examples/example-4/example-4.component.scss';
import { default as example4Html } from '!!raw-loader!./examples/example-4/example-4.component.html';

import { default as example5Scss } from '!!raw-loader!./examples/example-5/example-5.component.scss';
import { default as example5Html } from '!!raw-loader!./examples/example-5/example-5.component.html';

import { default as example6Scss } from '!!raw-loader!./examples/example-6/example-6.component.scss';
import { default as example6Html } from '!!raw-loader!./examples/example-6/example-6.component.html';

import { default as example7Scss } from '!!raw-loader!./examples/example-7/example-7.component.scss';
import { default as example7Html } from '!!raw-loader!./examples/example-7/example-7.component.html';

import { default as example8CalcBetweenScss } from '!!raw-loader!./examples/example-8/calc-between.example.scss';
import { default as example8Scss } from '!!raw-loader!./examples/example-8/example-8.component.scss';
import { default as example8Html } from '!!raw-loader!./examples/example-8/example-8.component.html';

import { default as example9Scss } from '!!raw-loader!./examples/example-9/example-9.component.scss';
import { default as example9Html } from '!!raw-loader!./examples/example-9/example-9.component.html';

@Component({
  selector: 'demo-adaptive-demo',
  templateUrl: './adaptive-demo.component.html',
  styleUrls: ['./adaptive-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdaptiveDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: example1Html,
    SCSS: example1Scss
  };

  public readonly example2Content: Record<string, string> = {
    HTML: example2Html,
    SCSS: example2Scss
  };

  public readonly example3Content: Record<string, string> = {
    HTML: example3Html,
    SCSS: example3Scss
  };

  public readonly example4Content: Record<string, string> = {
    HTML: example4Html,
    SCSS: example4Scss
  };

  public readonly example5Content: Record<string, string> = {
    HTML: example5Html,
    SCSS: example5Scss
  };

  public readonly example6Content: Record<string, string> = {
    HTML: example6Html,
    SCSS: example6Scss
  };

  public readonly example7Content: Record<string, string> = {
    HTML: example7Html,
    SCSS: example7Scss
  };

  public readonly example8CalcBetweenScss: string = example8CalcBetweenScss;
  public readonly example8Content: Record<string, string> = {
    HTML: example8Html,
    SCSS: example8Scss
  };

  public readonly example9Content: Record<string, string> = {
    HTML: example9Html,
    SCSS: example9Scss
  };
}

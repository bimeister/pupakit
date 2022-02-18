import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

interface TabItem {
  name: string;
  content: string;
  value: string;
}

@Component({
  selector: 'demo-tabs-example-7',
  templateUrl: './example-7.component.html',
  styleUrls: ['./example-7.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsExample7Component {
  public readonly tabs: TabItem[] = Array(100)
    .fill(null)
    .map((_: null, index: number) => ({
      name: `Tab ${index + 1}`,
      content: `Tab ${index + 1} content`,
      value: `tab${index + 1}`,
    }));
}

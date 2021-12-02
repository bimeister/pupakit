import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

interface Route {
  title: string;
  path: string;
  queryParams: Record<string, string>;
}

@Component({
  selector: 'demo-tabs-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsExample3Component {
  public readonly routes: Route[] = [
    {
      title: 'Route 1',
      path: '.',
      queryParams: { tab: 'tab1' },
    },
    {
      title: 'Route 2',
      path: '.',
      queryParams: { tab: 'tab2' },
    },
    {
      title: 'Route 3',
      path: '.',
      queryParams: { tab: 'tab3' },
    },
  ];
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

interface BlockItem {
  index: number;
  height: number;
}

const BLOCKS_COUNT: number = 100;

@Component({
  selector: 'demo-paged-virtual-scroll-demo',
  templateUrl: './paged-virtual-scroll-demo.component.html',
  styleUrls: ['./paged-virtual-scroll-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class PagedVirtualScrollDemoComponent {
  public readonly blocks: BlockItem[] = Array(BLOCKS_COUNT)
    .fill(0)
    .map((_block: unknown, index: number) => {
      return { index, height: Math.floor(Math.random() * 40) + 30 };
    });
}

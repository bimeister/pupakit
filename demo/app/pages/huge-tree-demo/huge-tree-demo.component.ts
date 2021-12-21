import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-huge-tree',
  styleUrls: ['./huge-tree-demo.component.scss'],
  templateUrl: './huge-tree-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class HugeTreeDemoComponent {}

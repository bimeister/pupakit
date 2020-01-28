import { ChangeDetectionStrategy, Component } from '@angular/core';
import { data } from 'src/lib/core/components/tree/data';
import { TreeItem } from 'src/lib/core/components/tree/tree.component';

@Component({
  selector: 'demo-tree-demo',
  templateUrl: './tree-demo.component.html',
  styleUrls: ['./tree-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDemoComponent {
  public readonly source: TreeItem[] = data;
}

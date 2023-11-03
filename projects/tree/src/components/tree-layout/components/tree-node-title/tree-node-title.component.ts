import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-tree-node-title',
  templateUrl: './tree-node-title.component.html',
  styleUrls: ['./tree-node-title.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeTitleComponent {}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-tree-node-description',
  templateUrl: './tree-node-description.component.html',
  styleUrls: ['./tree-node-description.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeDescriptionComponent {}

import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { getUuid } from '@bimeister/utilities';
import { DataEvent } from '../../../src/internal/declarations/classes/event/data.event';
import { TreeEvent } from '../../../src/internal/declarations/classes/event/tree.event';
import { TreeController } from '../../../src/internal/declarations/classes/tree-controller.class';
import { FlatTreeItem } from '../../../src/public-api';

const WOLF: FlatTreeItem = new FlatTreeItem(true, 'Wolves', null, getUuid(), { parentId: null });
const CAR: FlatTreeItem = new FlatTreeItem(true, 'Cars', null, getUuid(), { parentId: null });
const HAPPY: FlatTreeItem = new FlatTreeItem(false, '😀', null, getUuid(), { parentId: null });
const BURGER: FlatTreeItem = new FlatTreeItem(false, 'Burger', null, getUuid(), { parentId: null }, true);

const DATA: FlatTreeItem[] = [
  WOLF,
  ...generateChildren(WOLF.id, `${WOLF.name} child`, 10),
  CAR,
  ...generateChildren(CAR.id, `${CAR.name} child`, 500000),
  HAPPY,
  BURGER
];

@Component({
  selector: 'demo-new-tree',
  styleUrls: ['./tree-new-demo.component.scss'],
  templateUrl: './tree-new-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class TreeNewDemoComponent {
  public readonly controller: TreeController = new TreeController();

  constructor(public readonly injector: Injector) {
    this.controller.setData(this.fetch());
    this.controller
      .getEvents(TreeEvent.Expand)
      .subscribe((event: TreeEvent.Expand) => this.controller.setChildren(event.payload, this.fetch(event.payload)));
    this.controller
      .getEvents(DataEvent.Click)
      .subscribe((event: DataEvent.Click) => this.controller.setSelected(event.payload.id));
    this.controller
      .getEvents(TreeEvent.Collapse)
      .subscribe((event: TreeEvent.Collapse) => this.controller.removeChildren(event.payload));
  }

  private fetch(parentId: string = null): FlatTreeItem[] {
    const children: FlatTreeItem[] = [...DATA].filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return children;
  }
}

function generateChildren(parentId: string, name: string, leafElementsCount: number): FlatTreeItem[] {
  return new Array(leafElementsCount)
    .fill(null)
    .map((_, index: number) => new FlatTreeItem(false, `${name} ${index + 1}`, null, getUuid(), { parentId }, true));
}

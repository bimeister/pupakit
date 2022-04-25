import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { getUuid } from '@bimeister/utilities';
import { FlatTreeItem } from '@kit/internal/declarations/classes/flat-tree-item.class';
import { TreeController } from '@kit/internal/declarations/classes/tree-controller.class';
import { TreeEvents } from '@kit/internal/declarations/events/tree.events';
import { EventBus } from '@bimeister/event-bus/rxjs';

const WOLF: FlatTreeItem = new FlatTreeItem(true, 'Wolves', null, getUuid(), { parentId: null });
const CAR: FlatTreeItem = new FlatTreeItem(true, 'Cars', null, getUuid(), { parentId: WOLF.id });
const HAPPY: FlatTreeItem = new FlatTreeItem(false, '😀', null, getUuid(), { parentId: null });
const BURGER: FlatTreeItem = new FlatTreeItem(false, 'Burger', null, getUuid(), { parentId: null }, true);

const DATA: FlatTreeItem[] = [
  WOLF,
  ...generateChildren(WOLF.id, `${WOLF.name} child`, 3),
  CAR,
  ...generateChildren(CAR.id, `${CAR.name} child`, 3),
  HAPPY,
  BURGER,
];

@Component({
  selector: 'demo-new-tree',
  styleUrls: ['./tree-new-demo.component.scss'],
  templateUrl: './tree-new-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TreeNewDemoComponent {
  public readonly customTreeController: TreeController = new TreeController();
  public readonly defaultTreeController: TreeController = new TreeController();
  private readonly eventBus: EventBus;

  constructor(public readonly injector: Injector) {
    this.initController(this.customTreeController);
    this.initController(this.defaultTreeController);

    this.eventBus = this.customTreeController.eventBus;
  }

  public customTreeNodeClick(treeItem: FlatTreeItem): void {
    this.eventBus.dispatch(new TreeEvents.Click(treeItem));
  }

  private initController(controller: TreeController): void {
    controller.setChildren(null, this.fetch());
    controller
      .getEvents(TreeEvents.Expand)
      .subscribe((event: TreeEvents.Expand) => controller.setChildren(event.payload, this.fetch(event.payload)));
    controller
      .getEvents(TreeEvents.Click)
      .subscribe((event: TreeEvents.Click) => controller.setSelected(event.payload.id));
    controller
      .getEvents(TreeEvents.Collapse)
      .subscribe((event: TreeEvents.Collapse) => controller.removeChildren(event.payload));
  }

  private fetch(parentId: string = null): FlatTreeItem[] {
    const children: FlatTreeItem[] = [...DATA].filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return children;
  }
}

function generateChildren(parentId: string, name: string, leafElementsCount: number): FlatTreeItem[] {
  return new Array(leafElementsCount)
    .fill(null)
    .map(
      (_: null, index: number) => new FlatTreeItem(false, `${name} ${index + 1}`, null, getUuid(), { parentId }, true)
    );
}

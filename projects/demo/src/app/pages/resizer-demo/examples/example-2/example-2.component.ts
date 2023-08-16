import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { Subscription } from 'rxjs';
import { DATA as treeData } from '../../../tree-new-demo/examples/example-tree.data';
import { Uuid } from '@bimeister/pupakit.common';
import { getUuid } from '@bimeister/utilities';
import { TableColumnDefinition, TableColumnPin, TableController } from '@bimeister/pupakit.table';

interface SomeData {
  id: Uuid;
  firstName: string;
  lastName: string;
  age: number;
}

const DATA: SomeData[] = Array.from({ length: 300_000 }).map((_value: undefined, index: number) => ({
  id: getUuid(),
  firstName: `Azamat ${index}`,
  lastName: `Aitaliev ${index}`,
  city: 'Moscow',
  age: index + 1,
}));

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: `city`,
    modelKey: 'city',
    title: `City`,
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'age-column',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
  },
];

@Component({
  selector: 'demo-resizer-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizerDemoExample2Component implements OnDestroy {
  public readonly controller: TreeController = new TreeController();
  public readonly tableController: TableController<SomeData> = new TableController<SomeData>();

  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.initController();
    this.tableController.setColumnDefinitions(COLUMNS);
    this.tableController.setData(DATA);
    this.subscription.add(this.setChildrenOnExpand());
    this.subscription.add(this.removeChildrenOnCollapse());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initController(): void {
    this.controller.addChildren(null, this.fetch());
  }

  private setChildrenOnExpand(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Expand)
      .subscribe((event: TreeEvents.Expand) =>
        this.controller.addChildren(event.payload.id, this.fetch(event.payload.id))
      );
  }

  private removeChildrenOnCollapse(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Collapse)
      .subscribe((event: TreeEvents.Collapse) => this.controller.removeChildren(event.payload));
  }

  private fetch(parentId: string = null): FlatTreeItem[] {
    const children: FlatTreeItem[] = treeData.filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return children;
  }
}

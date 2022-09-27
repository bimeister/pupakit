import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TreeController } from '@kit/internal/declarations/classes/tree-controller.class';
import { FlatTreeItem } from '@kit/internal/declarations/classes/flat-tree-item.class';
import { TreeEvents } from '@kit/internal/declarations/events/tree.events';
import { Subscription } from 'rxjs';
import { DATA } from '../example-tree.data';

@Component({
  selector: 'demo-tree-new-example-8',
  templateUrl: './tree-new-example-8.component.html',
  styleUrls: ['./tree-new-example-8.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNewExample8Component implements OnDestroy {
  public readonly controller: TreeController = new TreeController();
  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.initController();
    this.subscription.add(this.setChildrenOnExpand());
    this.subscription.add(this.removeChildrenOnCollapse());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initController(): void {
    this.controller.setChildren(null, this.fetch());
  }

  public removeTreeItem(item: FlatTreeItem): void {
    this.controller.removeTreeItem(item.id);
  }

  private setChildrenOnExpand(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Expand)
      .subscribe((event: TreeEvents.Expand) => this.controller.setChildren(event.payload, this.fetch(event.payload)));
  }

  private removeChildrenOnCollapse(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Collapse)
      .subscribe((event: TreeEvents.Collapse) => this.controller.removeChildren(event.payload));
  }

  private fetch(parentId: string = null): FlatTreeItem[] {
    const children: FlatTreeItem[] = DATA.filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return children;
  }
}

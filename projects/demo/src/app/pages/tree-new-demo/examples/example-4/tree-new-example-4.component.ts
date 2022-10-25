import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { Subscription } from 'rxjs';
import { DATA } from '../example-tree.data';

@Component({
  selector: 'demo-tree-new-example-4',
  templateUrl: './tree-new-example-4.component.html',
  styleUrls: ['./tree-new-example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNewExample4Component implements OnDestroy {
  public readonly controller: TreeController = new TreeController();
  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.initController();
    this.subscription.add(this.setChildrenOnExpand());
    this.subscription.add(this.removeChildrenOnCollapse());
    this.subscription.add(this.setSelectedOnClick());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public initController(): void {
    this.controller.setChildren(null, this.fetch());
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

  private setSelectedOnClick(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Click)
      .subscribe((event: TreeEvents.Click) => this.controller.setSelected(event.payload.id));
  }

  private fetch(parentId: string = null): FlatTreeItem[] {
    const children: FlatTreeItem[] = DATA.filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return children;
  }
}

import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DATA } from '../example-tree.data';

@Component({
  selector: 'demo-tree-new-example-3',
  templateUrl: './tree-new-example-3.component.html',
  styleUrls: ['./tree-new-example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNewExample3Component implements OnDestroy {
  public readonly controller: TreeController = new TreeController();
  public readonly withActions: FormControl = new FormControl(true);

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

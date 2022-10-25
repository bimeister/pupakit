import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { Subscription } from 'rxjs';
import { DATA } from '../example-tree.data';

@Component({
  selector: 'demo-tree-new-example-5',
  templateUrl: './tree-new-example-5.component.html',
  styleUrls: ['./tree-new-example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNewExample5Component implements OnDestroy {
  public readonly controller: TreeController = new TreeController();
  private selectedIds: string[] = [];
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
    return this.controller.getEvents(TreeEvents.Click).subscribe((event: TreeEvents.Click) => {
      const selectedId: string = event.payload.id;
      if (this.selectedIds.includes(selectedId)) {
        this.selectedIds = this.selectedIds.filter((id: string) => id !== selectedId);
      } else {
        this.selectedIds.push(selectedId);
      }
      this.controller.setSelected(...this.selectedIds);
    });
  }

  private fetch(parentId: string = null): FlatTreeItem[] {
    const children: FlatTreeItem[] = DATA.filter((item: FlatTreeItem) => item.originalData.parentId === parentId);
    return children;
  }
}

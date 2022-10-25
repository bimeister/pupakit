import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DATA } from '../example-tree-for-scroll-demo.data';

@Component({
  selector: 'demo-tree-new-example-7',
  templateUrl: './tree-new-example-7.component.html',
  styleUrls: ['./tree-new-example-7.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNewExample7Component implements OnDestroy {
  public readonly controller: TreeController = new TreeController();
  public readonly treeNodeToScrollId$: Subject<string> = new Subject<string>();
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

  public scrollToTreeNode(): void {
    this.controller
      .getDataDisplayCollectionRef()
      .data$.pipe(take(1))
      .subscribe((data: FlatTreeItem[]) => {
        const randomIndex: number = Math.floor(Math.random() * 1000) % data.length;
        const treeNodeToScrollId: string = data[randomIndex].id;
        this.treeNodeToScrollId$.next(treeNodeToScrollId);
        this.controller.scrollTo(treeNodeToScrollId);
      });
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

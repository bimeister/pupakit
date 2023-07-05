import { Component, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FlatTreeItem, TreeController, TreeEvents } from '@bimeister/pupakit.tree';
import { Observable, Subject, Subscription } from 'rxjs';
import { DATA } from '../../../tree-new-demo/examples/example-tree.data';
import { map } from 'rxjs/operators';

@Component({
  selector: 'demo-flex-panel-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlexPanelDemoExample1Component implements OnDestroy {
  public readonly controller: TreeController = new TreeController();

  private readonly currentSize: Subject<number> = new Subject<number>();
  public currentSize$: Observable<string> = this.currentSize.pipe(map((size: number) => `${size}px`));

  private readonly subscription: Subscription = new Subscription();
  constructor() {
    this.initController();
    this.subscription.add(this.setChildrenOnExpand());
    this.subscription.add(this.removeChildrenOnCollapse());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public sizeChanged(size: number): void {
    this.currentSize.next(size);
  }

  public handlerMaxSizeReached(): void {
    console.log('handlerMaxSizeReached');
  }
  public handlerMinSizeReached(): void {
    console.log('handlerMinSizeReached');
  }
  public handleSizeChanged(sizePx: number): void {
    console.log('handleSizeChanged', sizePx);
  }

  public initController(): void {
    this.controller.setChildren(null, this.fetch());
  }

  private setChildrenOnExpand(): Subscription {
    return this.controller
      .getEvents(TreeEvents.Expand)
      .subscribe((event: TreeEvents.Expand) =>
        this.controller.setChildren(event.payload.id, this.fetch(event.payload.id))
      );
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

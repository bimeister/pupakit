import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  Renderer2,
  TrackByFunction,
  Type,
  ViewChild
} from '@angular/core';
import { EventBus } from '@bimeister/event-bus';
import { filterNotNil, filterTruthy, getClampedValue, isNil, Nullable } from '@bimeister/utilities';
import { animationFrameScheduler, BehaviorSubject, interval, NEVER, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounce, filter, map, mapTo, observeOn, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { DataEventBase } from '../../../../../internal/declarations/classes/data-event-base.class';
import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { RangedDataSource } from '../../../../../internal/declarations/classes/ranged-data-source.class';
import { TreeController } from '../../../../../internal/declarations/classes/tree-controller.class';
import { DataEvents } from '../../../../../internal/declarations/events/data.events';
import { QueueEvents } from '../../../../../internal/declarations/events/queue.events';
import { TreeEvents } from '../../../../../internal/declarations/events/tree.events';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DropEventInterface } from '../../../../../internal/declarations/interfaces/drop-event.interface';
import { TreeDataDisplayCollectionRef } from '../../../../../internal/declarations/interfaces/tree-data-display-collection-ref.interface';
import { TreeItemTemplateDirective } from '../../directives/tree-item-template.directive';

interface Position {
  top: number;
  left: number;
}
type ScrollDirection = null | 'up' | 'down';

const TREE_ITEM_SIZE_PX: number = 28;
const EXPAND_WHILE_DRAGGING_DELAY: number = 1000;

interface DragAndDropMeta {
  dragTreeItem: FlatTreeItem;
  dropTreeItem?: FlatTreeItem;
  dragTreeItemLeft?: number;
  dragTreeItemTop?: number;
  dragTreeItemWidth?: number;
  mouseDownPosition?: Position;
  scrollDirection?: ScrollDirection;
  draggableElementBoundingBox?: DOMRect;
  dragTreeItemIsDisplayed: boolean;
}

@Component({
  selector: 'pupa-tree-new',
  templateUrl: './tree-new.component.html',
  styleUrls: ['./tree-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeNewComponent<T> implements AfterViewInit, OnChanges {
  @Input() public controller: TreeController;
  @ViewChild('skeletonViewPort', { static: true }) public readonly skeletonViewPort: CdkVirtualScrollViewport;
  @ViewChild('viewPort', { static: true }) public readonly viewPort: CdkVirtualScrollViewport;
  @ContentChild(TreeItemTemplateDirective) public readonly treeItemTemplate: TreeItemTemplateDirective<T>;

  public dataSource: RangedDataSource;
  public dataDisplayCollection: TreeDataDisplayCollectionRef;
  public data$: Observable<FlatTreeItem[]>;
  public expandedIdsList$: Observable<string[]>;
  public selectedIdsList$: Observable<string[]>;
  public isLoading$: Observable<boolean>;
  public hasDragAndDrop$: Observable<boolean>;
  public trackBy$: Observable<TrackByFunction<FlatTreeItem>>;
  private scrollBehavior$: Observable<ScrollBehavior>;
  private eventBus: EventBus;

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeNewComponent.getLevel,
    TreeNewComponent.isExpandable
  );
  public readonly treeItemSizePx: number = TREE_ITEM_SIZE_PX;
  public readonly listRange$: BehaviorSubject<ListRange> = new BehaviorSubject(null);
  public readonly dragAndDropMeta$: BehaviorSubject<Nullable<DragAndDropMeta>> = new BehaviorSubject(null);
  private readonly expandWithDelay$: Subject<Nullable<FlatTreeItem>> = new Subject<Nullable<FlatTreeItem>>();
  private readonly subscription: Subscription = new Subscription();

  constructor(
    public readonly renderer: Renderer2,
    public readonly host: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.subscription.add(this.getSubscriptionToSetData());
    this.subscription.add(this.getSubscriptionToSetLoading());
    this.subscription.add(this.getSubscriptionToScrollToIndex());
    this.subscription.add(this.getSubscriptionToSetExpanded());
    this.subscription.add(this.getSubscriptionToSetSelected());
    this.subscription.add(this.getSubscriptionForScrollWithDrag());
    this.subscription.add(this.getSubscriptionForRangeChanges());
    this.subscription.add(this.getSubscriptionToExpandWhileDragging());
    this.eventBus.dispatch(new QueueEvents.StartQueue());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.setupController(changes?.controller);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public isExpanded(expandedIdsList: string[], treeItem: FlatTreeItem): boolean {
    return !isNil(treeItem) && treeItem.isExpandable && !treeItem.isElement && expandedIdsList.includes(treeItem.id);
  }

  public hasChild(_: number, treeItem: FlatTreeItem): boolean {
    return !isNil(treeItem) && treeItem.isExpandable && !treeItem.isElement;
  }

  public hasNoChild(_: number, treeItem: FlatTreeItem): boolean {
    return !isNil(treeItem) && !treeItem.isExpandable && !treeItem.isElement;
  }

  public isElement(_: number, treeItem: FlatTreeItem): boolean {
    return !isNil(treeItem) && !treeItem.isExpandable && treeItem.isElement;
  }

  public idsIncludesNodeId(idsList: string[], treeItem: FlatTreeItem): boolean {
    return idsList.includes(treeItem.id);
  }

  public mouseDown(dragTreeItem: FlatTreeItem, event: MouseEvent): void {
    this.hasDragAndDrop$.pipe(take(1), filterTruthy()).subscribe(() => {
      const mouseDownPosition: Position = { left: event?.screenX, top: event?.screenY };
      const target: EventTarget = event.target;
      const draggableElementBoundingBox: DOMRect =
        target instanceof HTMLElement ? target.getBoundingClientRect() : null;
      const dragTreeItemWidth: number = draggableElementBoundingBox?.width;
      this.dragAndDropMeta$.next({
        mouseDownPosition,
        dragTreeItem,
        draggableElementBoundingBox,
        dragTreeItemWidth,
        dragTreeItemIsDisplayed: false
      });
    });
  }

  public mouseEnter(treeItem: FlatTreeItem): void {
    this.dragAndDropMeta$.pipe(take(1), filterNotNil()).subscribe((dragAndDropMeta: DragAndDropMeta) => {
      this.dragAndDropMeta$.next({ ...dragAndDropMeta, dropTreeItem: treeItem });
      this.expandWithDelay$.next(treeItem);
    });
  }

  public mouseLeave(): void {
    this.dragAndDropMeta$.pipe(take(1), filterNotNil()).subscribe((dragAndDropMeta: DragAndDropMeta) => {
      this.dragAndDropMeta$.next({ ...dragAndDropMeta, dropTreeItem: null });
    });
  }

  @HostListener('window:mousemove', ['$event'])
  public mouseMove(event: MouseEvent): void {
    this.dragAndDropMeta$.pipe(take(1), filterNotNil()).subscribe((dragAndDropMeta: DragAndDropMeta) => {
      this.processDragMoving(dragAndDropMeta, event.screenX, event.screenY);
    });
  }

  @HostListener('window:mouseup')
  public mouseUp(): void {
    this.dragAndDropMeta$.pipe(take(1), filterNotNil()).subscribe((dragAndDropMeta: DragAndDropMeta) => {
      if (!dragAndDropMeta.dragTreeItemIsDisplayed) {
        return;
      }
      const dropEventData: DropEventInterface<FlatTreeItem> = {
        draggedElement: dragAndDropMeta.dragTreeItem,
        droppedElement: dragAndDropMeta.dropTreeItem
      };
      this.eventBus.dispatch(new DataEvents.Drop(dropEventData));
    });
    this.expandWithDelay$.next(null);
    this.dragAndDropMeta$.next(null);
  }

  public click(treeItem: FlatTreeItem): void {
    this.eventBus.dispatch(new DataEvents.Click(treeItem));
  }

  public toggleExpansion(expandedIdsList: string[], treeItem: FlatTreeItem): void {
    this.isExpanded(expandedIdsList, treeItem) ? this.collapseClick(treeItem) : this.expandClick(treeItem);
  }


  private setupController(change: ComponentChange<this, TreeController>): void {
    const value: Nullable<TreeController> = change?.currentValue;
    if (isNil(value)) {
      return;
    }
    this.controller = value;

    this.dataDisplayCollection = this.controller.getDataDisplayCollectionRef();
    this.eventBus = this.controller.eventBus;
    this.scrollBehavior$ = this.dataDisplayCollection.scrollBehavior$;
    this.trackBy$ = this.dataDisplayCollection.trackBy$;
    this.data$ = this.dataDisplayCollection.data$;
    this.isLoading$ = this.dataDisplayCollection.getIsLoading();
    this.selectedIdsList$ = this.dataDisplayCollection.selectedIdsList$;
    this.expandedIdsList$ = this.dataDisplayCollection.expandedIdsList$;
    this.hasDragAndDrop$ = this.dataDisplayCollection.hasDragAndDrop$;

    this.dataSource = new RangedDataSource(this.data$);
  }

  private expandClick(treeItem: FlatTreeItem): void {
    this.eventBus.dispatch(new TreeEvents.Expand(treeItem.id));
  }

  private collapseClick(treeItem: FlatTreeItem): void {
    this.eventBus.dispatch(new TreeEvents.Collapse(treeItem.id));
  }

  private getSubscriptionToExpandWhileDragging(): Subscription {
    return this.expandWithDelay$
      .pipe(
        debounce(node => (isNil(node) ? NEVER : timer(EXPAND_WHILE_DRAGGING_DELAY))),
        filter(treeItem => treeItem.isExpandable && !treeItem.isElement)
      )
      .subscribe((treeItem: FlatTreeItem) => {
        this.eventBus.dispatch(new TreeEvents.ExpandWhileDragging(treeItem.id));
      });
  }

  private getSubscriptionToSetData(): Subscription {
    return this.getEvents(DataEvents.SetData)
      .pipe(
        switchMap((event: DataEvents.SetData) => {
          return this.dataDisplayCollection.setData(event.payload).pipe(mapTo(event));
        })
      )
      .subscribe((event: DataEvents.SetData) => this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id)));
  }

  private getSubscriptionToSetLoading(): Subscription {
    return this.getEvents(DataEvents.SetLoading).subscribe((event: DataEvents.SetLoading) => {
      this.dataDisplayCollection.setIsLoading(event.payload);
      this.changeDetectorRef.detectChanges();
      this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
    });
  }

  private getSubscriptionToSetExpanded(): Subscription {
    return this.getEvents(TreeEvents.SetExpanded).subscribe((event: TreeEvents.SetExpanded) => {
      this.setExpandedIdsList(event.payload);
      this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
    });
  }

  private setExpandedIdsList(list: string[]): void {
    this.dataDisplayCollection.setExpandedIdsList(list);
    this.data$
      .pipe(
        take(1),
        map((data: FlatTreeItem[]) => data.filter((treeItem: FlatTreeItem) => list.includes(treeItem.id)))
      )
      .subscribe((data: FlatTreeItem[]) => {
        data.forEach((treeItem: FlatTreeItem) => this.treeControl.expand(treeItem));
      });
    this.changeDetectorRef.markForCheck();
  }

  private getSubscriptionToSetSelected(): Subscription {
    return this.getEvents(DataEvents.SetSelected).subscribe((event: DataEvents.SetSelected) => {
      this.setSelectedIdsList(event.payload);
      this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
    });
  }

  private setSelectedIdsList(list: string[]): void {
    this.dataDisplayCollection.setSelectedIdsList(list);
    this.changeDetectorRef.detectChanges();
  }

  private getSubscriptionToScrollToIndex(): Subscription {
    return this.getEvents(DataEvents.ScrollByIndex).subscribe((event: DataEvents.ScrollByIndex) => {
      this.scrollToIndex(event.payload);
      this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
    });
  }

  private scrollToIndex(index: number): void {
    this.scrollBehavior$.pipe(take(1)).subscribe((scrollBehavior: ScrollBehavior) => {
      this.viewPort.scrollToIndex(index, scrollBehavior);
      this.skeletonViewPort.scrollToIndex(index, scrollBehavior);
    });
  }

  private getSubscriptionForScrollWithDrag(): Subscription {
    return interval(0)
      .pipe(
        observeOn(animationFrameScheduler),
        switchMap(() => this.dragAndDropMeta$.pipe(take(1))),
        filterNotNil(),
        map((dragAndDropMeta: DragAndDropMeta) => dragAndDropMeta.scrollDirection),
        filterNotNil(),
        withLatestFrom(this.scrollBehavior$)
      )
      .subscribe(([scrollDirection, scrollBehavior]: [ScrollDirection, ScrollBehavior]) => {
        const scrollingSpeed: number = 5;
        const offsetDelta: number = scrollDirection === 'up' ? -scrollingSpeed : scrollingSpeed;
        const currentOffset: number = this.viewPort.measureScrollOffset();
        this.viewPort.scrollToOffset(currentOffset + offsetDelta, scrollBehavior);
      });
  }

  private getSubscriptionForRangeChanges(): void {
    this.viewPort.renderedRangeStream.subscribe((range: ListRange) => {
      this.dataSource.setRange(range);
    });
  }

  private getEvents<E extends DataEventBase>(eventType: Type<E>): Observable<E> {
    return this.eventBus.catchEvents().pipe(filter((event: DataEventBase): event is E => event instanceof eventType));
  }

  private processDragMoving(dragAndDropMeta: DragAndDropMeta, x: number, y: number): void {
    const draggableElementBoundingBox: DOMRect = dragAndDropMeta.draggableElementBoundingBox;
    const mouseDownPosition: Position = dragAndDropMeta.mouseDownPosition;
    const draggableElementPositionShift: Position = {
      left: mouseDownPosition?.left - draggableElementBoundingBox?.left,
      top: mouseDownPosition?.top - draggableElementBoundingBox?.top
    };
    const bottomBorderPositionY: number = this.host.nativeElement.clientHeight - draggableElementBoundingBox?.height;
    const newMeta: DragAndDropMeta = {
      ...dragAndDropMeta,
      dragTreeItemLeft: x - draggableElementBoundingBox?.left - draggableElementPositionShift.left,
      dragTreeItemTop: getClampedValue(y - draggableElementPositionShift.top, 0, bottomBorderPositionY)
    };
    const isTopBorderReached: boolean = newMeta.dragTreeItemTop <= draggableElementBoundingBox?.height;
    const isBottomBorderReached: boolean = newMeta.dragTreeItemTop >= bottomBorderPositionY;
    newMeta.scrollDirection = isTopBorderReached ? 'up' : isBottomBorderReached ? 'down' : null;
    newMeta.dragTreeItemIsDisplayed = true;

    this.dragAndDropMeta$.next(newMeta);
  }

  private static getLevel(treeItem: FlatTreeItem): number {
    return treeItem.level;
  }

  private static isExpandable(treeItem: FlatTreeItem): boolean {
    return treeItem.isExpandable;
  }
}

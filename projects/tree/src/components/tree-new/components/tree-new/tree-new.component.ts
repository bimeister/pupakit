import { ListRange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  TrackByFunction,
  Type,
  ViewChild,
} from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterNotNil, filterTruthy, getClampedValue, isNil, Nullable } from '@bimeister/utilities';
import {
  animationFrameScheduler,
  BehaviorSubject,
  combineLatest,
  interval,
  NEVER,
  Observable,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import { debounce, filter, map, observeOn, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { FlatTreeItem } from '../../../../declarations/classes/flat-tree-item.class';
import { TreeRangedDataSource } from '../../../../declarations/classes/tree-ranged-data-source.class';
import { TreeController } from '../../../../declarations/classes/tree-controller.class';
import { TreeEvents } from '../../../../declarations/events/tree.events';
import { DropEventInterface } from '../../../../declarations/interfaces/drop-event.interface';
import { TreeDataDisplayCollectionRef } from '../../../../declarations/interfaces/tree-data-display-collection-ref.interface';
import { TreeItemTemplateDirective } from '../../directives/tree-item-template.directive';
import { TreeNodeProperties } from '../../../../declarations/interfaces/tree-node-properties.interface';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ClientUiStateHandlerService, ComponentChange, ComponentChanges, QueueEvents } from '@bimeister/pupakit.common';

interface Position {
  top: number;
  left: number;
}

type ScrollDirection = null | 'up' | 'down';

const EXPAND_WHILE_DRAGGING_DELAY: number = 1000;
const TREE_ITEM_SIZE_REM: number = 8;
const ITEM_BUFFER_COUNT: number = 50;
const DRAG_CLONE_OFFSET_PX: number = 2;

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNewComponent<T> implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public controller: TreeController;
  @ViewChild('skeletonViewPort', { static: true }) public readonly skeletonViewPort: CdkVirtualScrollViewport;
  @ViewChild('viewPort', { static: true }) public readonly viewPort: CdkVirtualScrollViewport;
  @ContentChild(TreeItemTemplateDirective) public readonly treeItemTemplate: TreeItemTemplateDirective<T>;

  @Output() public readonly scrolledByY: EventEmitter<number> = new EventEmitter<number>();

  public dataSource: TreeRangedDataSource;
  public dataDisplayCollection: TreeDataDisplayCollectionRef;
  public data$: Observable<FlatTreeItem[]>;
  public expandedIdsList$: Observable<string[]>;
  public selectedIdsList$: Observable<string[]>;
  public isLoading$: Observable<boolean>;
  public hasDragAndDrop$: Observable<boolean>;
  public trackBy$: Observable<TrackByFunction<FlatTreeItem>>;
  public treeItemSizeRem$: Observable<number | undefined>;
  public treeItemSizePx$: Observable<number>;
  private scrollBehavior$: Observable<ScrollBehavior>;
  private eventBus: EventBus;

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeNewComponent.getLevel,
    TreeNewComponent.isExpandable
  );
  public readonly listRange$: BehaviorSubject<ListRange> = new BehaviorSubject(null);
  public readonly dragAndDropMeta$: BehaviorSubject<Nullable<DragAndDropMeta>> = new BehaviorSubject(null);

  public readonly bufferPx$: Observable<number> = this.clientUiStateHandlerService.remSizePx$.pipe(
    map((remSizePx: number) => remSizePx * TREE_ITEM_SIZE_REM * ITEM_BUFFER_COUNT)
  );

  private readonly expandWithDelay$: Subject<Nullable<FlatTreeItem>> = new Subject<Nullable<FlatTreeItem>>();
  private readonly subscription: Subscription = new Subscription();

  constructor(
    public readonly renderer: Renderer2,
    public readonly host: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService
  ) {}

  public ngAfterViewInit(): void {
    this.subscription.add(this.getSubscriptionToSetLoading());
    this.subscription.add(this.getSubscriptionToScrollToIndex());
    this.subscription.add(this.getSubscriptionToScrollTop());
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
      const mouseDownPosition: Position = { left: event.clientX, top: event.clientY };
      const target: EventTarget = event.currentTarget;
      const draggableElementBoundingBox: DOMRect | null =
        target instanceof HTMLElement ? target.getBoundingClientRect() : null;
      const dragTreeItemWidth: number = draggableElementBoundingBox?.width;
      this.dragAndDropMeta$.next({
        mouseDownPosition,
        dragTreeItem,
        dropTreeItem: dragTreeItem,
        draggableElementBoundingBox,
        dragTreeItemWidth,
        dragTreeItemIsDisplayed: false,
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
      this.processDragMoving(dragAndDropMeta, event.clientX, event.clientY);
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
        droppedElement: dragAndDropMeta.dropTreeItem,
      };
      this.eventBus.dispatch(new TreeEvents.Drop(dropEventData));
    });
    this.expandWithDelay$.next(null);
    this.dragAndDropMeta$.next(null);
  }

  public click(treeItem: FlatTreeItem): void {
    this.eventBus.dispatch(new TreeEvents.Click(treeItem));
  }

  public toggleExpansion(expandedIdsList: string[], treeItem: FlatTreeItem): void {
    this.isExpanded(expandedIdsList, treeItem) ? this.collapseClick(treeItem) : this.expandClick(treeItem);
  }

  public getTreeNodeProperties(node: FlatTreeItem): Observable<TreeNodeProperties> {
    return combineLatest([this.expandedIdsList$, this.selectedIdsList$]).pipe(
      map(
        ([expandedIdsList, selectedIdsList]: [string[], string[]]): TreeNodeProperties => ({
          level: node.level,
          isDirectory: !node.isElement,
          hasChildren: node.isExpandable,
          isLoading: false,
          isExpanded: this.isExpanded(expandedIdsList, node),
          isSelected: this.idsIncludesNodeId(selectedIdsList, node),
          isHighlighted: this.idsIncludesNodeId(selectedIdsList, node),
          isDisabled: false,
          expand: () => {
            this.toggleExpansion(expandedIdsList, node);
          },
        })
      )
    );
  }

  public onScroll(): void {
    const scrollTopPx: number = this.viewPort.elementRef.nativeElement.scrollTop;
    this.scrolledByY.emit(scrollTopPx);
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
    this.treeItemSizeRem$ = this.dataDisplayCollection.treeItemSizeRem$;
    this.data$ = this.dataDisplayCollection.data$;
    this.isLoading$ = this.dataDisplayCollection.isLoading$;
    this.selectedIdsList$ = this.dataDisplayCollection.selectedIdsList$;
    this.expandedIdsList$ = this.dataDisplayCollection.expandedIdsList$;
    this.hasDragAndDrop$ = this.dataDisplayCollection.hasDragAndDrop$;

    this.treeItemSizePx$ = combineLatest([
      this.clientUiStateHandlerService.remSizePx$,
      this.treeItemSizeRem$.pipe(filterNotNil()),
    ]).pipe(map(([remSizePx, treeItemSize]: [number, number]) => remSizePx * treeItemSize));

    this.dataSource = new TreeRangedDataSource(this.data$);
  }

  private expandClick(treeItem: FlatTreeItem): void {
    this.controller.expand(treeItem);
  }

  private collapseClick(treeItem: FlatTreeItem): void {
    this.eventBus.dispatch(new TreeEvents.Collapse(treeItem.id));
  }

  private getSubscriptionToExpandWhileDragging(): Subscription {
    return this.expandWithDelay$
      .pipe(
        debounce((node: FlatTreeItem) => (isNil(node) ? NEVER : timer(EXPAND_WHILE_DRAGGING_DELAY))),
        filter((treeItem: FlatTreeItem) => treeItem.isExpandable && !treeItem.isElement)
      )
      .subscribe((treeItem: FlatTreeItem) => {
        this.eventBus.dispatch(new TreeEvents.ExpandWhileDragging(treeItem.id));
      });
  }

  private getSubscriptionToSetLoading(): Subscription {
    return this.getEvents(TreeEvents.SetLoading).subscribe((event: TreeEvents.SetLoading) => {
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
    return this.getEvents(TreeEvents.SetSelected).subscribe((event: TreeEvents.SetSelected) => {
      this.setSelectedIdsList(event.payload);
      this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
    });
  }

  private setSelectedIdsList(list: string[]): void {
    this.dataDisplayCollection.setSelectedIdsList(list);
    this.changeDetectorRef.detectChanges();
  }

  private getSubscriptionToScrollToIndex(): Subscription {
    return this.getEvents(TreeEvents.ScrollByIndex).subscribe((event: TreeEvents.ScrollByIndex) => {
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

  private getSubscriptionToScrollTop(): Subscription {
    return this.getEvents(TreeEvents.ScrollTop).subscribe((event: TreeEvents.ScrollTop) => {
      this.scrollTop(event.payload);
      this.eventBus.dispatch(new QueueEvents.RemoveFromQueue(event.id));
    });
  }

  private scrollTop(scrollTopPx: number): void {
    this.viewPort.scrollTo({
      top: scrollTopPx,
    });
    this.skeletonViewPort.scrollTo({
      top: scrollTopPx,
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

  private getSubscriptionForRangeChanges(): Subscription {
    return this.viewPort.renderedRangeStream.subscribe((range: ListRange) => {
      this.dataSource.setRange(range);
    });
  }

  private getEvents<E extends TreeEvents.TreeEventBase>(eventType: Type<E>): Observable<E> {
    return this.eventBus
      .listen()
      .pipe(filter((event: TreeEvents.TreeEventBase): event is E => event instanceof eventType));
  }

  private processDragMoving(dragAndDropMeta: DragAndDropMeta, mouseX: number, mouseY: number): void {
    const draggableElementBoundingBox: DOMRect = dragAndDropMeta.draggableElementBoundingBox;
    const bottomBorderPositionY: number = this.host.nativeElement.clientHeight - draggableElementBoundingBox?.height;
    const { left: hostElementLeft, top: hostElementTop }: DOMRect = this.host.nativeElement.getBoundingClientRect();

    const dragTreeItemLeft: number = mouseX - hostElementLeft + DRAG_CLONE_OFFSET_PX;
    const dragTreeItemTop: number = mouseY - hostElementTop + DRAG_CLONE_OFFSET_PX;

    const newMeta: DragAndDropMeta = {
      ...dragAndDropMeta,
      dragTreeItemLeft,
      dragTreeItemTop: getClampedValue(dragTreeItemTop, 0, bottomBorderPositionY),
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

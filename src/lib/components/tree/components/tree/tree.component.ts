import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import { isNil } from '@bimeister/utilities/commonjs/common';
import { filterNotNil, shareReplayWithRefCount } from '@bimeister/utilities/commonjs/rxjs';
import {
  animationFrameScheduler,
  asyncScheduler,
  BehaviorSubject,
  interval,
  NEVER,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  timer
} from 'rxjs';
import { debounce, distinctUntilChanged, filter, map, observeOn, subscribeOn, take } from 'rxjs/operators';
import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { TreeManipulator } from '../../../../../internal/declarations/classes/tree-manipulator.class';
import { TreeType } from '../../../../../internal/declarations/enums/tree-type.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DropEventInterface } from '../../../../../internal/declarations/interfaces/drop-event.interface';
import { TreeDataSource } from '../../../../../internal/declarations/interfaces/tree-data-source.interface';
import { TreeItemInterface } from '../../../../../internal/declarations/interfaces/tree-item.interface';
import { TreeManipulatorDataOrigin } from '../../../../../internal/declarations/types/tree-manipulator-data-origin.type';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { clamp } from '../../../../../internal/helpers/clamp.helper';

interface Position {
  top: number;
  left: number;
}

type CdkTreeNodeDefWhen<T> = (index: number, nodeData: T) => boolean;

const DEFAULT_TRACK_BY_FUNCTION: TrackByFunction<FlatTreeItem> = (index: number, item: FlatTreeItem): string => {
  if (isNil(item)) {
    return `${index}__null_null_null_null`;
  }
  const { id, isExpandable, level, name }: FlatTreeItem = item;
  return `${index}__${id}_${isExpandable}_${level}_${name}`;
};
const NODE_HAS_CHILD_COMPARATOR: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, node: FlatTreeItem): boolean => {
  return !isNil(node) && node.isExpandable && !node.isElement;
};
const NODE_HAS_NO_CHILD_COMPARATOR: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, node: FlatTreeItem): boolean =>
  !isNil(node) && !node.isExpandable && !node.isElement;
const NODE_IS_ELEMENT: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, element: FlatTreeItem): boolean => {
  return !isNil(element) && !element.isExpandable && element.isElement;
};
const TREE_ITEM_SIZE_PX: number = 28;
@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  public readonly hasChild: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_HAS_CHILD_COMPARATOR;
  public readonly hasNoChild: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_HAS_NO_CHILD_COMPARATOR;
  public readonly isElement: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_IS_ELEMENT;
  public readonly treeItemSizePx: number = TREE_ITEM_SIZE_PX;

  private readonly subscription: Subscription = new Subscription();

  @ViewChild('viewPort', { static: true }) private readonly viewPort: CdkVirtualScrollViewport;
  @ViewChild('skeletonViewPort', { static: true }) private readonly skeletonViewPort: CdkVirtualScrollViewport;

  /**
   * @description
   * Already flatten tree data source.
   */
  @Input() public readonly flatDataOrigin: FlatTreeItem[] = [];

  /**
   * @description
   * Flatten tree nodes (folders) to be combined with treeElementsOrigin.
   */
  @Input() public readonly treeNodesOrigin: TreeItemInterface[] = [];

  /**
   * @description
   * Flatten tree elements (folder items) to be combined with treeNodesOrigin.
   */
  @Input() public readonly treeElementsOrigin: TreeItemInterface[] = [];

  @Input() public readonly nodeTemplate?: TemplateRef<any>;
  @Input() public readonly trackBy?: TrackByFunction<FlatTreeItem>;
  @Input() public readonly selectedNodesIds?: string[];
  @Input() public readonly highlightedNodesIds?: string[];
  @Input() public readonly scrollByRoute?: string[];
  @Input() public readonly scrollBehaviour: ScrollBehavior = 'smooth';
  @Input() public readonly hasDragAndDrop: boolean = false;
  @Input() public readonly hideRoot: boolean = false;
  @Input() public readonly isLoading: boolean = false;
  @Input() public readonly showLoaderOnInternalProcessings: boolean = true;

  @Input() public readonly nodesWithoutPadding: boolean = false;

  @Output() public readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter();
  @Output() private readonly dropped: EventEmitter<DropEventInterface<FlatTreeItem>> = new EventEmitter();

  @Output() private readonly visibleElementsCountChanged: EventEmitter<number> = new EventEmitter();

  public readonly trackBy$: BehaviorSubject<TrackByFunction<FlatTreeItem>> = new BehaviorSubject(
    DEFAULT_TRACK_BY_FUNCTION
  );
  public readonly flatDataOrigin$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject([]);
  public readonly treeNodesOrigin$: BehaviorSubject<TreeItemInterface[]> = new BehaviorSubject([]);
  public readonly treeElementsOrigin$: BehaviorSubject<TreeItemInterface[]> = new BehaviorSubject([]);
  public readonly selectedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly highlightedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly hideRoot$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private readonly viewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject(1);
  private readonly skeletonViewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject(1);

  private readonly manipulatorDataOrigin: TreeManipulatorDataOrigin;
  private readonly manipulator: TreeManipulator;

  public readonly expandedItemIds$: Observable<Set<string>>;

  public readonly treeControl: FlatTreeControl<FlatTreeItem>;
  public readonly dataSource: TreeDataSource;
  public readonly filteredSource$: Observable<FlatTreeItem[]>;
  public readonly flatTreeItems$: Observable<FlatTreeItem[]>;
  public readonly processingIsActive$: BehaviorSubject<boolean>;

  public readonly expandNodeWithDelay$: Subject<FlatTreeItem | null> = new Subject<FlatTreeItem | null>();

  private scrollDirection: null | 'up' | 'down' = null;

  @ViewChild('draggable')
  private readonly draggableElement: ElementRef<HTMLElement>;

  public draggingHasStarted: boolean = false;

  /** @deprecated mutable object */
  public draggableNode: FlatTreeItem | null;

  /** @deprecated mutable object */
  private dropNode: FlatTreeItem | null;

  /** @deprecated mutable object */
  private mouseDownPosition: Position | null = null;

  /** @deprecated mutable object */
  private draggableElementBoundingBox: DOMRect | null = null;

  private draggableExpandableDescendands: Uuid[] = [];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly renderer: Renderer2,
    private readonly host: ElementRef<HTMLElement>,
    @Attribute('type') private readonly type: TreeType
  ) {
    switch (this.type) {
      case TreeType.Flat: {
        const dataOrigin: TreeManipulatorDataOrigin = {
          type: this.type,
          flatDataOrigin: this.flatDataOrigin$,
          hideRoot: this.hideRoot$
        };
        this.manipulatorDataOrigin = dataOrigin;
        break;
      }

      case TreeType.Hierarchical: {
        const dataOrigin: TreeManipulatorDataOrigin = {
          type: this.type,
          treeElementsOrigin: this.treeElementsOrigin$,
          treeNodesOrigin: this.treeNodesOrigin$,
          hideRoot: this.hideRoot$
        };
        this.manipulatorDataOrigin = dataOrigin;
        break;
      }

      case TreeType.Custom: {
        const dataOrigin: TreeManipulatorDataOrigin = {
          type: this.type,
          hideRoot: this.hideRoot$
        };
        this.manipulatorDataOrigin = dataOrigin;
        break;
      }

      default: {
        throw new Error('Specified type is not a valid type of pupa-tree.');
      }
    }

    this.manipulator = new TreeManipulator(
      this.manipulatorDataOrigin,
      this.viewPortReference$,
      this.skeletonViewPortReference$,
      this.treeItemSizePx
    );

    this.expandedItemIds$ = this.manipulator.expandedItemIds$.pipe(shareReplayWithRefCount());
    this.treeControl = this.manipulator.treeControl;
    this.dataSource = this.manipulator.dataSource;
    this.filteredSource$ = this.manipulator.dataSource.filteredData$;
    this.flatTreeItems$ = this.dataSource.sortedData$;
    this.processingIsActive$ = this.manipulator.processingIsActive$;
  }

  public ngOnInit(): void {
    this.subscription
      .add(this.emitExpandedItemOnNodeExpansion())
      .add(this.detectChangesOnNodeExpansion())
      .add(this.scrollByIndexOnEmit())
      .add(this.scrollViewportDuringDragging())
      .add(this.expandNodeDuringDragging())
      .add(this.handleCountOfVisibleElementsChanges())
      .add(this.showLoaderOnActiveProcessing());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processTrackByValueChange(changes?.trackBy);
    this.processFlatDataOriginValueChange(changes?.flatDataOrigin);
    this.processTreeNodesDataOriginValueChange(changes?.treeNodesOrigin);
    this.processTreeElementsDataOriginValueChange(changes?.treeElementsOrigin);
    this.processSelectedNodesIdsValueChange(changes?.selectedNodesIds);
    this.processHighlightedNodesIdsValueChange(changes?.highlightedNodesIds);
    this.processScrollByRouteValueChanges(changes?.scrollByRoute);
    this.processHideRootValueChanges(changes?.hideRoot);
    this.processIsLoadingValueChanges(changes?.isLoading);
  }

  public ngAfterContentInit(): void {
    this.viewPortReference$.next(this.viewPort);
    this.skeletonViewPortReference$.next(this.skeletonViewPort);

    this.manipulator.initialize();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.manipulator.destroy();
  }

  public viewPortInitialize(): void {
    this.viewPortReference$.next(this.viewPort);
    this.skeletonViewPortReference$.next(this.skeletonViewPort);
    this.manipulator.initialize();
  }

  public refreshViewPort(): void {
    this.manipulator.refreshViewPort();
  }

  public idsIncludesNodeId(ids: string[], node: FlatTreeItem): boolean {
    return !isNil(node) && Array.isArray(ids) && ids.includes(node.id);
  }

  public toggleExpansion(node: FlatTreeItem): void {
    if (isNil(node?.id)) {
      return;
    }
    this.manipulator.toggleExpansion(node);
  }

  public expand(...nodes: FlatTreeItem[]): void {
    const expandableNodes: FlatTreeItem[] = nodes.filter((node: FlatTreeItem) => node.isExpandable && !node.isElement);

    timer(0, asyncScheduler)
      .pipe(observeOn(asyncScheduler), subscribeOn(asyncScheduler))
      .subscribe(() => {
        this.manipulator.expand(expandableNodes, false);
      });
  }

  public expandAllNodes(): void {
    this.flatTreeItems$
      .pipe(
        take(1),
        observeOn(asyncScheduler),
        subscribeOn(asyncScheduler),
        map((flatTreeItems: FlatTreeItem[]) => flatTreeItems.filter((treeItem: FlatTreeItem) => treeItem.isExpandable))
      )
      .subscribe((flatTreeNodes: FlatTreeItem[]) => {
        flatTreeNodes.forEach((node: FlatTreeItem) => this.treeControl.expand(node));
      });
  }

  public isExpanded(expandedItemsIds: Set<string>, node: FlatTreeItem): boolean {
    return expandedItemsIds.has(node.id);
  }

  public mouseDown(treeNode: FlatTreeItem, event: MouseEvent): void {
    if (!this.hasDragAndDrop) {
      return;
    }

    this.draggableNode = treeNode;
    this.mouseDownPosition = {
      left: event.screenX,
      top: event.screenY
    };
    if (event.target instanceof HTMLElement) {
      this.draggableElementBoundingBox = event.target.getBoundingClientRect();
    }
  }

  @HostListener('window:mousemove', ['$event'])
  public mouseMove({ screenX, screenY }: MouseEvent): void {
    if (isNil(this.mouseDownPosition)) {
      return;
    }

    const dragDistanceSqr: number =
      Math.pow(this.mouseDownPosition.left - screenX, 2) + Math.pow(this.mouseDownPosition.top - screenY, 2);

    const druggingMustBeStarted: boolean = dragDistanceSqr > this.draggableElementBoundingBox.height / 2;
    if (!this.draggingHasStarted && druggingMustBeStarted) {
      this.startDragging();
      this.draggingHasStarted = true;
    }

    if (this.draggingHasStarted) {
      this.updateDraggablePosition(screenX, screenY);
    }
  }

  @HostListener('window:mouseup')
  public mouseUp(): void {
    if (this.draggingHasStarted && !isNil(this.dropNode)) {
      this.dropped.emit({
        draggedElement: this.draggableNode,
        droppedElement: this.dropNode
      });
    }

    this.draggingHasStarted = false;
    this.draggableNode = null;
    this.dropNode = null;
    this.mouseDownPosition = null;
    this.draggableElementBoundingBox = null;
    this.scrollDirection = null;
    this.draggableExpandableDescendands = [];
  }

  public mouseEnter(node: FlatTreeItem): void {
    if (!this.draggingHasStarted) {
      return;
    }

    if (!node.isElement) {
      this.dropNode = node;
    }

    if (this.canDrop(node)) {
      this.expandNodeWithDelay$.next(node);
    }
  }

  public canDrop(node: FlatTreeItem): boolean {
    return node.isExpandable && !this.draggableExpandableDescendands.includes(node.id);
  }

  public mouseLeave(): void {
    if (!this.draggingHasStarted) {
      return;
    }

    this.dropNode = null;
    this.expandNodeWithDelay$.next(null);
  }

  private startDragging(): void {
    this.setupWidthForDraggableElement();
    this.setupDraggableExpandableDescendands();
  }

  private setupWidthForDraggableElement(): void {
    timer(0)
      .pipe(take(1))
      .subscribe(() => {
        this.renderer.setStyle(
          this.draggableElement.nativeElement,
          'width',
          `${this.draggableElementBoundingBox.width}px`
        );
      });
  }

  private setupDraggableExpandableDescendands(): void {
    this.manipulator.rawData$.pipe(take(1)).subscribe((treeItems: FlatTreeItem[]) => {
      const targetLevel: number = this.draggableNode.level;

      let currentIndex: number = treeItems.findIndex(dataPoint => dataPoint.id === this.draggableNode.id) + 1;
      const endOfListNotReached = (): boolean => treeItems.length !== currentIndex;
      const targetLevelNotReached = (): boolean => treeItems[currentIndex].level !== targetLevel;
      const result: Uuid[] = [this.draggableNode.id];

      while (endOfListNotReached() && targetLevelNotReached()) {
        const currentNode: FlatTreeItem = treeItems[currentIndex];
        if (currentNode.isExpandable) {
          result.push(currentNode.id);
        }
        currentIndex++;
      }

      this.draggableExpandableDescendands = result;
    });
  }

  private updateDraggablePosition(screenX: number, screenY: number): void {
    const draggableElementPositionShift: Position = {
      left: this.mouseDownPosition.left - this.draggableElementBoundingBox.left,
      top: this.mouseDownPosition.top - this.draggableElementBoundingBox.top
    };

    const bottomBorderPositionY: number =
      this.host.nativeElement.clientHeight - this.draggableElementBoundingBox.height;
    const draggableElementPosition: Position = {
      left: screenX - this.draggableElementBoundingBox.left - draggableElementPositionShift.left,
      top: clamp(screenY - draggableElementPositionShift.top, 0, bottomBorderPositionY)
    };

    const isTopBorderReached: boolean = draggableElementPosition.top <= this.draggableElementBoundingBox.height;
    const isBottomBorderReached: boolean = draggableElementPosition.top >= bottomBorderPositionY;

    this.scrollDirection = isTopBorderReached ? 'up' : isBottomBorderReached ? 'down' : null;

    if (!isNil(this.draggableElement)) {
      this.renderer.setStyle(this.draggableElement.nativeElement, 'left', `${draggableElementPosition.left}px`);
      this.renderer.setStyle(this.draggableElement.nativeElement, 'top', `${draggableElementPosition.top}px`);
    }
  }

  private processTrackByValueChange(change: ComponentChange<this, TrackByFunction<FlatTreeItem>>): void {
    const newValue: TrackByFunction<FlatTreeItem> | undefined = change?.currentValue;
    if (isNil(newValue)) {
      return;
    }
    this.trackBy$.next(newValue);
  }

  private processFlatDataOriginValueChange(change: ComponentChange<this, FlatTreeItem[]>): void {
    const newValue: FlatTreeItem[] | undefined = change?.currentValue;
    if (!Array.isArray(newValue)) {
      return;
    }
    this.flatDataOrigin$.next(newValue);
  }

  private processTreeNodesDataOriginValueChange(change: ComponentChange<this, TreeItemInterface[]>): void {
    const newValue: TreeItemInterface[] | undefined = change?.currentValue;
    if (!Array.isArray(newValue)) {
      return;
    }
    this.treeNodesOrigin$.next(newValue);
  }

  private processTreeElementsDataOriginValueChange(change: ComponentChange<this, TreeItemInterface[]>): void {
    const newValue: TreeItemInterface[] | undefined = change?.currentValue;
    if (!Array.isArray(newValue)) {
      return;
    }
    this.treeElementsOrigin$.next(newValue);
  }

  private processSelectedNodesIdsValueChange(change: ComponentChange<this, string[]>): void {
    const newValue: string[] | undefined = change?.currentValue;
    if (!Array.isArray(newValue)) {
      return;
    }
    this.selectedNodesIds$.next(newValue);
  }

  private processHighlightedNodesIdsValueChange(change: ComponentChange<this, string[]>): void {
    const newValue: string[] | undefined = change?.currentValue;
    if (!Array.isArray(newValue)) {
      return;
    }
    this.highlightedNodesIds$.next(newValue);
  }

  private processScrollByRouteValueChanges(change: ComponentChange<this, string[]>): void {
    const newValue: string[] | undefined = change?.currentValue;
    if (!Array.isArray(newValue)) {
      return;
    }
    this.manipulator.scrollByRoute(newValue);
  }

  private processHideRootValueChanges(change: ComponentChange<this, boolean>): void {
    const newValue: boolean | undefined = change?.currentValue;
    if (isNil(newValue)) {
      return;
    }
    this.hideRoot$.next(newValue);
  }

  private processIsLoadingValueChanges(change: ComponentChange<this, boolean>): void {
    const newValue: boolean | undefined = change?.currentValue;
    if (isNil(newValue)) {
      return;
    }
    this.isLoading$.next(newValue);
  }

  private emitExpandedItemOnNodeExpansion(): Subscription {
    return this.manipulator.itemToExpand$
      .pipe(filterNotNil())
      .subscribe((item: FlatTreeItem) => this.expandedNode.emit(item));
  }

  private detectChangesOnNodeExpansion(): Subscription {
    return this.manipulator.expandedItemIds$
      .pipe(filterNotNil())
      .subscribe(() => this.changeDetectorRef.markForCheck());
  }

  private scrollByIndexOnEmit(): Subscription {
    return this.manipulator.indexToScrollBy$.subscribe((targetIndex: number) => {
      this.viewPort.scrollToIndex(targetIndex, this.scrollBehaviour);
      this.skeletonViewPort.scrollToIndex(targetIndex, this.scrollBehaviour);
    });
  }

  private expandNodeDuringDragging(): Subscription {
    const expandDelay: number = 1000;
    return this.expandNodeWithDelay$
      .pipe(
        debounce(node => (isNil(node) ? NEVER : timer(expandDelay))),
        filter(nodeToExpand => !this.treeControl.isExpanded(nodeToExpand))
      )
      .subscribe((nodeToExpand: FlatTreeItem) => {
        this.treeControl.expand(nodeToExpand);
        this.manipulator.toggleExpansion(nodeToExpand);
      });
  }

  private handleCountOfVisibleElementsChanges(): Subscription {
    return this.filteredSource$
      .pipe(
        map((filteredSource: FlatTreeItem[]) => (isNil(filteredSource) ? 0 : filteredSource.length)),
        distinctUntilChanged()
      )
      .subscribe(countOfVisibleElements => this.visibleElementsCountChanged.emit(countOfVisibleElements));
  }

  private scrollViewportDuringDragging(): Subscription {
    return interval(0)
      .pipe(
        observeOn(animationFrameScheduler),
        filter(() => !isNil(this.scrollDirection))
      )
      .subscribe(() => {
        const scrollingSpeed: number = 5;
        const offsetDelta: number = this.scrollDirection === 'up' ? -scrollingSpeed : scrollingSpeed;
        const currentOffset: number = this.viewPort.measureScrollOffset();
        this.viewPort.scrollToOffset(currentOffset + offsetDelta, this.scrollBehaviour);
      });
  }

  private showLoaderOnActiveProcessing(): Subscription {
    return this.processingIsActive$
      .pipe(
        debounce((isActive: boolean) => {
          if (isActive) {
            return timer(500);
          }

          return timer(0);
        }),
        distinctUntilChanged()
      )
      .subscribe((processingIsActive: boolean) => this.isLoading$.next(processingIsActive));
  }
}

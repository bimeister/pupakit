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
import {
  animationFrameScheduler,
  BehaviorSubject,
  interval,
  NEVER,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  timer
} from 'rxjs';
import { debounce, debounceTime, filter, observeOn, take } from 'rxjs/operators';

import { FlatTreeDataSource } from '../../../../../internal/declarations/classes/flat-tree-data-source.class';
import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { TreeManipulator } from '../../../../../internal/declarations/classes/tree-manipulator.class';
import { TreeType } from '../../../../../internal/declarations/enums/tree-type.enum';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { DropEventInterface } from '../../../../../internal/declarations/interfaces/drop-event.interface';
import { TreeItemInterface } from '../../../../../internal/declarations/interfaces/tree-item.interface';
import { TreeManipulatorDataOrigin } from '../../../../../internal/declarations/types/tree-manipulator-data-origin.type';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { clamp } from '../../../../../internal/helpers/clamp.helper';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

interface Position {
  top: number;
  left: number;
}

type HideRoot = 'true' | 'false';

type CdkTreeNodeDefWhen<T> = (index: number, nodeData: T) => boolean;

const DEFAULT_TRACK_BY_FUNCTION: TrackByFunction<FlatTreeItem> = (_index: number, item: FlatTreeItem): string => {
  return item?.id;
};
const NODE_HAS_CHILD_COMPARATOR: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, node: FlatTreeItem): boolean => {
  return !isNullOrUndefined(node) && node.isExpandable && !node.isElement;
};
const NODE_HAS_NO_CHILD_COMPARATOR: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, node: FlatTreeItem): boolean =>
  !isNullOrUndefined(node) && !node.isExpandable && !node.isElement;
const NODE_IS_ELEMENT: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, element: FlatTreeItem): boolean => {
  return !isNullOrUndefined(element) && !element.isExpandable && element.isElement;
};
const NODE_EXPANSION_CHANGE_DETECTION_DEBOUNCE_TIME_MS: number = 500;
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

  @Output() private readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter();
  @Output() private readonly dropped: EventEmitter<DropEventInterface<FlatTreeItem>> = new EventEmitter();

  public readonly trackBy$: BehaviorSubject<TrackByFunction<FlatTreeItem>> = new BehaviorSubject(
    DEFAULT_TRACK_BY_FUNCTION
  );
  public readonly flatDataOrigin$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject([]);
  public readonly treeNodesOrigin$: BehaviorSubject<TreeItemInterface[]> = new BehaviorSubject([]);
  public readonly treeElementsOrigin$: BehaviorSubject<TreeItemInterface[]> = new BehaviorSubject([]);
  public readonly selectedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly highlightedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  private readonly viewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject(1);
  private readonly skeletonViewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject(1);

  private readonly manipulatorDataOrigin: TreeManipulatorDataOrigin;
  private readonly manipulator: TreeManipulator;

  public readonly treeControl: FlatTreeControl<FlatTreeItem>;
  public readonly dataSource: FlatTreeDataSource;
  public readonly filteredSource$: Observable<FlatTreeItem[]>;

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
    @Attribute('type') private readonly type: TreeType,
    @Attribute('hideRoot') private readonly hideRoot: HideRoot = 'false'
  ) {
    const rootNodesShouldBeHidden: boolean = this.hideRoot === 'true';

    switch (this.type) {
      case TreeType.Flat: {
        const dataOrigin: TreeManipulatorDataOrigin = {
          type: this.type,
          flatDataOrigin: this.flatDataOrigin$,
          hideRoot: rootNodesShouldBeHidden
        };
        this.manipulatorDataOrigin = dataOrigin;
        break;
      }
      case TreeType.Hierarchical: {
        const dataOrigin: TreeManipulatorDataOrigin = {
          type: this.type,
          treeElementsOrigin: this.treeElementsOrigin$,
          treeNodesOrigin: this.treeNodesOrigin$,
          hideRoot: rootNodesShouldBeHidden
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

    this.treeControl = this.manipulator.treeControl;
    this.dataSource = this.manipulator.dataSource;
    this.filteredSource$ = this.manipulator.dataSource.filteredData$;
  }

  public ngOnInit(): void {
    this.subscription
      .add(this.emitExpandedItemOnNodeExpansion())
      .add(this.detectChangesOnNodeExpansion())
      .add(this.scrollByIndexOnEmit())
      .add(this.scrollViewportDuringDragging())
      .add(this.expandNodeDuringDragging());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNullOrUndefined(changes)) {
      return;
    }
    this.processTrackByValueChange(changes?.trackBy);
    this.processFlatDataOriginValueChange(changes?.flatDataOrigin);
    this.processTreeNodesDataOriginValueChange(changes?.treeNodesOrigin);
    this.processTreeElementsDataOriginValueChange(changes?.treeElementsOrigin);
    this.processSelectedNodesIdsValueChange(changes?.selectedNodesIds);
    this.processHighlightedNodesIdsValueChange(changes?.highlightedNodesIds);
    this.processScrollByRouteValueChanges(changes?.scrollByRoute);
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

  public idsIncludesNodeId(ids: string[], node: FlatTreeItem): boolean {
    return !isNullOrUndefined(node) && Array.isArray(ids) && ids.includes(node.id);
  }

  public toggleExpansion(node: FlatTreeItem): void {
    if (isNullOrUndefined(node?.id)) {
      return;
    }
    this.manipulator.toggleExpansion(node);
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
    if (isNullOrUndefined(this.mouseDownPosition)) {
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
    if (this.draggingHasStarted && !isNullOrUndefined(this.dropNode)) {
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

    if (!isNullOrUndefined(this.draggableElement)) {
      this.renderer.setStyle(this.draggableElement.nativeElement, 'left', `${draggableElementPosition.left}px`);
      this.renderer.setStyle(this.draggableElement.nativeElement, 'top', `${draggableElementPosition.top}px`);
    }
  }

  private processTrackByValueChange(change: ComponentChange<this, TrackByFunction<FlatTreeItem>>): void {
    const newValue: TrackByFunction<FlatTreeItem> | undefined = change?.currentValue;
    if (isNullOrUndefined(newValue)) {
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

  private emitExpandedItemOnNodeExpansion(): Subscription {
    return this.manipulator.itemToExpand$
      .pipe(filter((item: FlatTreeItem) => !isNullOrUndefined(item)))
      .subscribe((item: FlatTreeItem) => this.expandedNode.emit(item));
  }

  private detectChangesOnNodeExpansion(): Subscription {
    return this.manipulator.itemToExpand$
      .pipe(
        filter(
          (item: FlatTreeItem) => !isNullOrUndefined(item),
          debounceTime(NODE_EXPANSION_CHANGE_DETECTION_DEBOUNCE_TIME_MS)
        )
      )
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
        debounce(node => (isNullOrUndefined(node) ? NEVER : timer(expandDelay))),
        filter(nodeToExpand => !this.treeControl.isExpanded(nodeToExpand))
      )
      .subscribe((nodeToExpand: FlatTreeItem) => {
        this.treeControl.expand(nodeToExpand);
        this.manipulator.toggleExpansion(nodeToExpand);
      });
  }

  private scrollViewportDuringDragging(): Subscription {
    return interval(0)
      .pipe(
        observeOn(animationFrameScheduler),
        filter(() => !isNullOrUndefined(this.scrollDirection))
      )
      .subscribe(() => {
        const scrollingSpeed: number = 5;
        const offsetDelta: number = this.scrollDirection === 'up' ? -scrollingSpeed : scrollingSpeed;
        const currentOffset: number = this.viewPort.measureScrollOffset();
        this.viewPort.scrollToOffset(currentOffset + offsetDelta, this.scrollBehaviour);
      });
  }
}

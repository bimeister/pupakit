import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterContentInit,
  AfterViewInit,
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
import { debounce, debounceTime, filter, map, observeOn, withLatestFrom } from 'rxjs/operators';
import { FlatTreeDataSource } from '../../../../../internal/declarations/classes/flat-tree-data-source.class';
import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { TreeManipulator } from '../../../../../internal/declarations/classes/tree-manipulator.class';
import { clamp } from '../../../../../internal/helpers/clamp.helper';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { DropEventInterface } from '../../../../../internal/declarations/interfaces/drop-event.interface';

interface Position {
  top: number;
  left: number;
}

type CdkTreeNodeDefWhen<T> = (index: number, nodeData: T) => boolean;

const DEFAULT_TRACK_BY_FUNCTION: TrackByFunction<FlatTreeItem> = (_index: number, item: FlatTreeItem): string => {
  return item?.id;
};
const NODE_HAS_CHILD_COMPARATOR: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, node: FlatTreeItem): boolean => {
  return !isNullOrUndefined(node) && node.isExpandable && !node.isElement;
};
const NODE_HAS_NO_CHILD_COMPARATOR: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, node: FlatTreeItem): boolean =>
  !isNullOrUndefined(node) && !node.isExpandable && !node.isElement;
const NODE_IS_ELEMENT: CdkTreeNodeDefWhen<FlatTreeItem> = (_: number, element: FlatTreeItem): boolean =>
  !isNullOrUndefined(element) && !element.isExpandable && element.isElement;

const NODE_EXPANSION_CHANGE_DETECTION_DEBOUNCE_TIME_MS: number = 500;
const TREE_ITEM_SIZE_PX: number = 28;
@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy, AfterViewInit {
  public readonly hasChild: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_HAS_CHILD_COMPARATOR;
  public readonly hasNoChild: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_HAS_NO_CHILD_COMPARATOR;
  public readonly isElement: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_IS_ELEMENT;
  public readonly treeItemSizePx: number = TREE_ITEM_SIZE_PX;

  private readonly subscription: Subscription = new Subscription();

  @ViewChild('viewPort', { static: true }) private readonly viewPort: CdkVirtualScrollViewport;
  @ViewChild('skeletonViewPort', { static: true }) private readonly skeletonViewPort: CdkVirtualScrollViewport;
  @ViewChild('defaultTemplate', { static: true }) private readonly defaultTemplate: TemplateRef<any>;

  @Input() public readonly dataOrigin: FlatTreeItem[];
  @Input() public readonly nodeTemplate?: TemplateRef<any>;
  @Input() public readonly elementTemplate?: TemplateRef<any>;
  @Input() public readonly trackBy?: TrackByFunction<FlatTreeItem>;
  @Input() public readonly selectedNodesIds?: string[];
  @Input() public readonly highlightedNodesIds?: string[];
  @Input() public readonly scrollByRoute?: string[];
  @Input() public readonly scrollAnimationIsEnabled?: boolean;
  @Input() public readonly hasDragAndDrop: boolean = false;

  @Output() private readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter();
  @Output() private readonly dropped: EventEmitter<DropEventInterface<FlatTreeItem>> = new EventEmitter();

  public readonly nodeTemplate$: BehaviorSubject<TemplateRef<any>> = new BehaviorSubject(this.defaultTemplate);
  public readonly elementTemplate$: BehaviorSubject<TemplateRef<any>> = new BehaviorSubject(this.defaultTemplate);
  public readonly trackBy$: BehaviorSubject<TrackByFunction<FlatTreeItem>> = new BehaviorSubject(
    DEFAULT_TRACK_BY_FUNCTION
  );
  public readonly dataOrigin$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject([]);
  public readonly selectedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly highlightedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private readonly scrollAnimationIsEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private readonly viewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject(1);
  private readonly skeletonViewPortReference$: ReplaySubject<CdkVirtualScrollViewport> = new ReplaySubject(1);

  private readonly manipulator: TreeManipulator = new TreeManipulator(
    this.dataOrigin$,
    this.viewPortReference$,
    this.skeletonViewPortReference$,
    this.treeItemSizePx
  );

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = this.manipulator.treeControl;
  public readonly dataSource: FlatTreeDataSource = this.manipulator.dataSource;
  public readonly filteredSource$: Observable<FlatTreeItem[]> = this.dataSource.filteredData$;

  public readonly expandNodeWithDelay$: Subject<FlatTreeItem | null> = new Subject<FlatTreeItem | null>();
  private scrollDirection: null | 'up' | 'down' = null;

  @ViewChild('draggable')
  private readonly draggableElement: ElementRef<HTMLElement>;

  public draggingHasStarted: boolean = false;
  public draggableNode: FlatTreeItem | null;
  private dropNode: FlatTreeItem | null;

  private mouseDownPosition: Position | null = null;
  private draggableElementBoundingBox: DOMRect | null = null;

  private draggableExpandableDescendands: Uuid[] = [];

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly renderer: Renderer2,
    private readonly host: ElementRef<HTMLElement>
  ) {}

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
    this.processNodeTemplateValueChange(changes?.nodeTemplate);
    this.processElementTemplateValueChange(changes?.elementTemplate);
    this.processTrackByValueChange(changes?.trackBy);
    this.processDataOriginValueChange(changes?.dataOrigin);
    this.processSelectedNodesIdsValueChange(changes?.selectedNodesIds);
    this.processHighlightedNodesIdsValueChange(changes?.highlightedNodesIds);
    this.processScrollByRouteValueChanges(changes?.scrollByRoute);
    this.processScrollAnimationIsEnabledValueChanges(changes?.scrollAnimationIsEnabled);
  }

  public ngAfterViewInit(): void {
    this.nodeTemplate$.next(this.defaultTemplate);
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

    this.draggableElementBoundingBox = (event.target as HTMLElement).getBoundingClientRect();
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
    this.dropped.emit({
      draggedElement: this.draggableNode,
      droppedElement: this.dropNode
    });

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
    setTimeout(() => {
      this.renderer.setStyle(
        this.draggableElement.nativeElement,
        'width',
        `${this.draggableElementBoundingBox.width}px`
      );
    });
  }

  private setupDraggableExpandableDescendands(): void {
    const targetLevel: number = this.draggableNode.level;

    let currentIndex: number = this.dataOrigin.findIndex(dataPoint => dataPoint.id === this.draggableNode.id) + 1;
    const endOfListNotReached = (): boolean => this.dataOrigin.length !== currentIndex;
    const targetLevelNotReached = (): boolean => this.dataOrigin[currentIndex].level !== targetLevel;
    const result: Uuid[] = [this.draggableNode.id];

    while (endOfListNotReached() && targetLevelNotReached()) {
      const currentNode: FlatTreeItem = this.dataOrigin[currentIndex];
      if (currentNode.isExpandable) {
        result.push(currentNode.id);
      }
      currentIndex++;
    }

    this.draggableExpandableDescendands = result;
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

  private processNodeTemplateValueChange(change: ComponentChange<this, TemplateRef<any>>): void {
    const newValue: TemplateRef<any> | undefined = change?.currentValue;
    if (isNullOrUndefined(newValue)) {
      return;
    }
    this.nodeTemplate$.next(newValue);
  }

  private processElementTemplateValueChange(change: ComponentChange<this, TemplateRef<any>>): void {
    const newValue: TemplateRef<any> | undefined = change?.currentValue;
    if (isNullOrUndefined(newValue)) {
      return;
    }
    this.elementTemplate$.next(newValue);
  }

  private processTrackByValueChange(change: ComponentChange<this, TrackByFunction<FlatTreeItem>>): void {
    const newValue: TrackByFunction<FlatTreeItem> | undefined = change?.currentValue;
    if (isNullOrUndefined(newValue)) {
      return;
    }
    this.trackBy$.next(newValue);
  }

  private processDataOriginValueChange(change: ComponentChange<this, FlatTreeItem[]>): void {
    const newValue: FlatTreeItem[] | undefined = change?.currentValue;
    if (!Array.isArray(newValue)) {
      return;
    }
    this.dataOrigin$.next(newValue);
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

  private processScrollAnimationIsEnabledValueChanges(change: ComponentChange<this, boolean>): void {
    const newValue: boolean | undefined = change?.currentValue;
    if (isNullOrUndefined(newValue)) {
      return;
    }
    this.scrollAnimationIsEnabled$.next(newValue);
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
    return this.manipulator.indexToScrollBy$
      .pipe(
        withLatestFrom(
          this.scrollAnimationIsEnabled$.pipe(
            map((scrollAnimationIsEnabled: boolean) => (scrollAnimationIsEnabled ? 'smooth' : 'auto'))
          )
        )
      )
      .subscribe(([targetIndex, scrollBehavior]: [number, ScrollBehavior]) => {
        this.viewPort.scrollToIndex(targetIndex, scrollBehavior);
        this.skeletonViewPort.scrollToIndex(targetIndex, scrollBehavior);
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
        this.viewPort.scrollToOffset(currentOffset + offsetDelta, this.scrollAnimationIsEnabled ? 'smooth' : 'auto');
      });
  }
}

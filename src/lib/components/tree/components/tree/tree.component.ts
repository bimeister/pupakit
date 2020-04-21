import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  AfterContentInit
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription, ReplaySubject } from 'rxjs';
import { filter, debounceTime, withLatestFrom, map } from 'rxjs/operators';
import { FlatTreeDataSource } from '../../../../../internal/declarations/classes/flat-tree-data-source.class';
import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { NewTreeManipulator } from './_tree-manipulator';

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

  @Output() private readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter();

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

  private readonly manipulator: NewTreeManipulator = new NewTreeManipulator(
    this.dataOrigin$,
    this.selectedNodesIds$,
    this.viewPortReference$,
    this.skeletonViewPortReference$
  );

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = this.manipulator.treeControl;
  public readonly dataSource: FlatTreeDataSource = this.manipulator.dataSource;
  public readonly filteredSource$: Observable<FlatTreeItem[]> = this.dataSource.filteredData$;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.subscription
      .add(this.emitExpandedItemOnNodeExpansion())
      .add(this.detectChangesOnNodeExpansion())
      .add(this.scrollByIndexOnEmit());
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

  public getRenderingAreaItems(filteredSource: FlatTreeItem[], nonFilteredSource: FlatTreeItem[]): FlatTreeItem[] {
    if (Array.isArray(filteredSource) && !Object.is(filteredSource.length, 0)) {
      return filteredSource;
    }
    return nonFilteredSource;
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
}

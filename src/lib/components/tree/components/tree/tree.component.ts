import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { VOID } from '../../../../../internal/constants/void.const';
import { FlatTreeDataSource } from '../../../../../internal/declarations/classes/flat-tree-data-source.class';
import { FlatTreeItem } from '../../../../../internal/declarations/classes/flat-tree-item.class';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { FlatTreeManipulator } from '../../../../../internal/declarations/classes/flat-tree-manipulator.class';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';

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
/** @deprecated needs refactoring */
@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  public readonly hasChild: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_HAS_CHILD_COMPARATOR;
  public readonly hasNoChild: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_HAS_NO_CHILD_COMPARATOR;
  public readonly isElement: CdkTreeNodeDefWhen<FlatTreeItem> = NODE_IS_ELEMENT;

  private readonly subscription: Subscription = new Subscription();

  @ViewChild('viewPort', { static: false }) private readonly viewPort: CdkVirtualScrollViewport;
  @ViewChild('skeletonViewPort', { static: false }) private readonly skeletonViewPort: CdkVirtualScrollViewport;
  @ViewChild('defaultTemplate', { static: true }) private readonly defaultTemplate: TemplateRef<any>;

  @Input() public readonly dataOrigin: FlatTreeItem[];
  @Input() public readonly nodeTemplate?: TemplateRef<any>;
  @Input() public readonly elementTemplate?: TemplateRef<any>;
  @Input() public readonly trackBy?: TrackByFunction<FlatTreeItem>;
  @Input() public readonly selectedNodesIds?: string[];
  @Input() public readonly highlightedNodesIds?: string[];
  @Input() public readonly scrollByRoute?: string[];
  @Input() public readonly scrollAnimationIsEnabled?: boolean;

  @Output() private readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter<FlatTreeItem>();

  public readonly nodeTemplate$: BehaviorSubject<TemplateRef<any>> = new BehaviorSubject(this.defaultTemplate);
  public readonly elementTemplate$: BehaviorSubject<TemplateRef<any>> = new BehaviorSubject(this.defaultTemplate);
  public readonly trackBy$: BehaviorSubject<TrackByFunction<FlatTreeItem>> = new BehaviorSubject(
    DEFAULT_TRACK_BY_FUNCTION
  );
  public readonly dataOrigin$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject([]);
  public readonly selectedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public readonly highlightedNodesIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public readonly scrollByRoute$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public readonly scrollAnimationIsEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly manipulator: FlatTreeManipulator = new FlatTreeManipulator({
    dataOrigin$: this.dataOrigin$,
    scrollByRoute$: this.scrollByRoute$,
    selectedNodesIds$: this.selectedNodesIds$
  });

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = this.manipulator.treeControl;
  public readonly dataSource: FlatTreeDataSource = this.manipulator.dataSource;
  public readonly filteredSource$: Observable<FlatTreeItem[]> = this.dataSource.filteredData$;

  constructor(public readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.subscription
      .add(this.emitExpandedItemOnAction())
      .add(this.markTargetItemParentsAsExpanded())
      .add(this.scrollToTargetOnTargetChange());
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
    this.subscription.add(this.updateRangeOnDataExtraction());
    this.refreshViewPort();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public idsIncludesNodeId(ids: string[], node: FlatTreeItem): boolean {
    return !isNullOrUndefined(node) && Array.isArray(ids) && ids.includes(node.id);
  }

  public toggleExpansion(node: FlatTreeItem): void {
    if (isNullOrUndefined(node?.id)) {
      return;
    }
    this.manipulator.toggleExpansion(node);
    this.refreshViewPort();
  }

  public getRenderingAreaSkeleton(filteredSource: FlatTreeItem[], nonFilteredSource: FlatTreeItem[]): FlatTreeItem[] {
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
    this.scrollByRoute$.next(newValue);
  }

  private processScrollAnimationIsEnabledValueChanges(change: ComponentChange<this, boolean>): void {
    const newValue: boolean | undefined = change?.currentValue;
    if (isNullOrUndefined(newValue)) {
      return;
    }
    this.scrollAnimationIsEnabled$.next(newValue);
  }

  private updateRangeOnDataExtraction(): Subscription {
    return this.viewPort.renderedRangeStream.subscribe((range: ListRange) =>
      this.manipulator.updateVisibleRange(range)
    );
  }

  private scrollToTargetOnTargetChange(): Subscription {
    const renderedItemsIds$: Observable<string[]> = combineLatest([this.filteredSource$, this.dataOrigin$]).pipe(
      map(([filteredSource, dataOrigin]: [FlatTreeItem[], FlatTreeItem[]]) =>
        this.getRenderingAreaSkeleton(filteredSource, dataOrigin)
      ),
      filter((items: FlatTreeItem[]) => Array.isArray(items) && !Object.is(items.length, 0)),
      map((items: FlatTreeItem[]) => items.map((item: FlatTreeItem) => item.id))
    );

    const triggerTargetItemRefresh$: Observable<void> = combineLatest([
      this.scrollByRoute$,
      this.filteredSource$.pipe(filter((renderedItems: FlatTreeItem[]) => !Object.is(renderedItems.length, 0)))
    ]).pipe(
      tap(() => this.refreshViewPort()),
      mapTo(VOID)
    );

    const targetIndexes$: Observable<number[]> = triggerTargetItemRefresh$.pipe(
      switchMapTo(renderedItemsIds$),
      withLatestFrom(this.scrollByRoute$),
      map(([sourceItemsIds, route]: [string[], string[]]) => route.map((id: string) => sourceItemsIds.indexOf(id))),
      filter((indexes: number[]) => indexes.every((index: number) => index >= 0)),
      distinctUntilChanged((previousIndexes: number[], currentIndexes: number[]) => {
        if (isNullOrUndefined(currentIndexes)) {
          return true;
        }
        const previousTarget: number = previousIndexes[previousIndexes.length - 1];
        const currentTarget: number = currentIndexes[currentIndexes.length - 1];
        return Object.is(previousTarget, currentTarget);
      })
    );

    return targetIndexes$
      .pipe(
        withLatestFrom(
          this.scrollAnimationIsEnabled$.pipe(
            map((scrollAnimationIsEnabled: boolean) => (scrollAnimationIsEnabled ? 'smooth' : 'auto'))
          )
        )
      )
      .subscribe(([indexes, scrollAnimationBehavior]: [number[], ScrollBehavior]) => {
        indexes.forEach((index: number) => {
          this.viewPort.scrollToIndex(index, scrollAnimationBehavior);
          this.skeletonViewPort.scrollToIndex(index, scrollAnimationBehavior);

          this.refreshViewPort();
        });
      });
  }

  private emitExpandedItemOnAction(): Subscription {
    return this.manipulator.itemToExpand$
      .pipe(filter((item: FlatTreeItem) => !isNullOrUndefined(item)))
      .subscribe((item: FlatTreeItem) => this.expandedNode.emit(item));
  }

  private markTargetItemParentsAsExpanded(): Subscription {
    return this.scrollByRoute$
      .pipe(
        filter((route: string[]) => route.length > 1),
        distinctUntilChanged((previousRoute: string[], currentRoute: string[]) => {
          if (isNullOrUndefined(currentRoute)) {
            return true;
          }
          const previousParent: string = previousRoute[previousRoute.length - 1];
          const currentParent: string = currentRoute[currentRoute.length - 1];
          return previousParent === currentParent;
        }),
        map((route: string[]) => route.slice(0, route.length - 1))
      )
      .subscribe((parentIds: string[]) =>
        parentIds.forEach((id: string) => {
          this.manipulator.markIdAsExpanded(id);
          this.refreshViewPort();
        })
      );
  }

  private refreshViewPort(): void {
    if (isNullOrUndefined(this.viewPort)) {
      return;
    }
    this.viewPort.checkViewportSize();
    this.skeletonViewPort.checkViewportSize();
  }
}

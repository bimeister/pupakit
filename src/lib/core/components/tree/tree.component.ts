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
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  skipUntil,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';
import { FlatTreeDataSource, FlatTreeItem, TreeManipulator } from './classes';

@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnChanges, AfterViewInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @ViewChild('viewPort', { static: false }) private readonly viewPort: CdkVirtualScrollViewport;
  @ViewChild('defaultNodeTemplate', { static: true }) private readonly defaultNodeTemplate: TemplateRef<any>;

  @Input() public readonly manipulator: TreeManipulator;

  @Output() private readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter<FlatTreeItem>();

  private readonly manipulator$: BehaviorSubject<TreeManipulator> = new BehaviorSubject<TreeManipulator>(null);
  public readonly notNilManipulator$: Observable<TreeManipulator> = this.manipulator$.pipe(
    filter(manipulator => !isNullOrUndefined(manipulator)),
    shareReplay(1)
  );

  public readonly nodeTemplate$: Observable<TemplateRef<any>> = this.manipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.nodeTemplate),
    map((customNodeTemplate: TemplateRef<any>) =>
      isNullOrUndefined(customNodeTemplate) ? this.defaultNodeTemplate : customNodeTemplate
    )
  );
  public readonly trackBy$: Observable<TrackByFunction<FlatTreeItem>> = this.manipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.trackBy)
  );
  public readonly dataSource$: Observable<FlatTreeDataSource> = this.notNilManipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.dataSource)
  );
  public readonly treeControl$: Observable<FlatTreeControl<FlatTreeItem>> = this.notNilManipulator$.pipe(
    map((manipulator: TreeManipulator) => manipulator.treeControl)
  );
  public readonly dataOrigin$: Observable<FlatTreeItem[]> = this.notNilManipulator$.pipe(
    switchMap((manipulator: TreeManipulator) => manipulator.dataOrigin$)
  );
  public readonly selectedNodesIds$: Observable<string[]> = this.notNilManipulator$.pipe(
    switchMap((manipulator: TreeManipulator) => manipulator.selectedNodesIds$)
  );
  public filteredSource$: Observable<FlatTreeItem[]> = this.notNilManipulator$.pipe(
    switchMap((manipulator: TreeManipulator) => manipulator.dataSource.filteredData$),
    tap(() => this.refreshViewPort())
  );
  private readonly scrollByRoute$: Observable<string[]> = this.notNilManipulator$.pipe(
    switchMap((manipulator: TreeManipulator) => manipulator.scrollByRoute$)
  );

  constructor() {
    this.subscription
      .add(this.emitExpandedItemOnAction())
      .add(this.markTargetItemParentsAsExpanded())
      .add(this.scrollToTargetOnTargetChange());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      isNullOrUndefined(changes) ||
      isNullOrUndefined(changes.manipulator) ||
      isNullOrUndefined(changes.manipulator.currentValue) ||
      !changes.manipulator.isFirstChange()
    ) {
      return;
    }
    this.handleTreeManipulator(this.manipulator);
  }

  public ngAfterViewInit(): void {
    this.subscribeOnDataExtractionOnScrolling();
    this.refreshViewPort();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public nodeIsSelected(node: FlatTreeItem, selectedNodesIds: string[]): boolean {
    return !isNullOrUndefined(node) && Array.isArray(selectedNodesIds) && selectedNodesIds.includes(node.id);
  }

  public toggleExpansion(node: FlatTreeItem): void {
    this.notNilManipulator$
      .pipe(
        filter(() => !isNullOrUndefined(node)),
        switchMap((manipulator: TreeManipulator) => manipulator.expandedItemsIds$),
        map((expandedItemsIds: string[]) => expandedItemsIds.includes(node.id)),
        withLatestFrom(this.notNilManipulator$),
        take(1)
      )
      .subscribe(([isExpanded, manipulator]: [boolean, TreeManipulator]) => {
        isExpanded ? manipulator.markAsCollapsed(node) : manipulator.markAsExpanded(node);
        this.refreshViewPort();
      });
  }

  public getRenderingAreaSkeleton(filteredSource: FlatTreeItem[], nonFilteredSource: FlatTreeItem[]): FlatTreeItem[] {
    if (Array.isArray(filteredSource) && !Object.is(filteredSource.length, 0)) {
      return filteredSource;
    }
    return nonFilteredSource;
  }

  private handleTreeManipulator(manipulator: TreeManipulator): void {
    this.manipulator$.next(manipulator);
  }

  private refreshViewPort(): void {
    if (isNullOrUndefined(this.viewPort)) {
      return;
    }
    this.viewPort.checkViewportSize();
  }

  private subscribeOnDataExtractionOnScrolling(): void {
    const viewPortRerenderingSubscription: Subscription = this.viewPort.renderedRangeStream
      .pipe(skipUntil(this.notNilManipulator$.pipe(take(1))))
      .subscribe((range: ListRange) => this.manipulator.updateVisibleRange(range));
    this.subscription.add(viewPortRerenderingSubscription);
  }

  private scrollToTargetOnTargetChange(): Subscription {
    const targetItemId$: Observable<string> = this.scrollByRoute$.pipe(
      filter((route: string[]) => Array.isArray(route)),
      map((route: string[]) => (Object.is(route.length, 1) ? route[0] : route[route.length - 1])),
      distinctUntilChanged()
    );

    const renderedItemsIds$: Observable<string[]> = combineLatest([this.filteredSource$, this.dataOrigin$]).pipe(
      map(([filteredSource, dataOrigin]: [FlatTreeItem[], FlatTreeItem[]]) =>
        this.getRenderingAreaSkeleton(filteredSource, dataOrigin)
      ),
      filter((items: FlatTreeItem[]) => Array.isArray(items) && !Object.is(items.length, 0)),
      map((items: FlatTreeItem[]) => items.map((item: FlatTreeItem) => item.id))
    );

    const targetItemIndex$: Observable<number> = combineLatest([this.scrollByRoute$, renderedItemsIds$]).pipe(
      map(([_, renderedItemsIds]: [string[], string[]]) => renderedItemsIds),
      withLatestFrom(targetItemId$),
      map(([sourceItemsIds, targetItemId]: [string[], string]) => sourceItemsIds.indexOf(targetItemId)),
      filter((targetItemIndex: number) => targetItemIndex >= 0),
      distinctUntilChanged()
    );

    return targetItemIndex$.subscribe((index: number) => {
      this.viewPort.scrollToIndex(index, 'smooth');
      this.refreshViewPort();
    });
  }

  private emitExpandedItemOnAction(): Subscription {
    return this.manipulator$
      .pipe(
        filter((manipulator: TreeManipulator) => !isNullOrUndefined(manipulator)),
        switchMap((manipulator: TreeManipulator) =>
          manipulator.itemToExpand$.pipe(filter((item: FlatTreeItem) => !isNullOrUndefined(item)))
        )
      )
      .subscribe(item => this.expandedNode.emit(item));
  }

  private markTargetItemParentsAsExpanded(): Subscription {
    return this.scrollByRoute$
      .pipe(
        filter((route: string[]) => Array.isArray(route) && route.length > 1),
        map((route: string[]) => route.slice(0, route.length - 1)),
        withLatestFrom(this.notNilManipulator$)
      )
      .subscribe(([parentIds, manipulator]: [string[], TreeManipulator]) =>
        parentIds.forEach((id: string) => {
          manipulator.markIdAsExpanded(id);
          this.refreshViewPort();
        })
      );
  }

  public readonly hasChild = (_: number, node: FlatTreeItem): boolean => !isNullOrUndefined(node) && node.isExpandable;
  public readonly hasNoChild = (_: number, node: FlatTreeItem): boolean =>
    !isNullOrUndefined(node) && !node.isExpandable;
}

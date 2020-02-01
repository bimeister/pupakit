import { DataSource, ListRange } from '@angular/cdk/collections';
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
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, shareReplay, skipUntil, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';
import { FlatTreeItem, TreeConfiguration, TreeItem } from './classes';

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

  @Input() public readonly configuration: TreeConfiguration;
  private readonly configuration$: BehaviorSubject<TreeConfiguration> = new BehaviorSubject<TreeConfiguration>(null);
  public readonly notNilConfiguration$: Observable<TreeConfiguration> = this.configuration$.pipe(
    filter(configuration => !isNullOrUndefined(configuration)),
    shareReplay(1)
  );

  public readonly nodeTemplate$: Observable<TemplateRef<any>> = this.configuration$.pipe(
    map((configuration: TreeConfiguration) => configuration.nodeTemplate),
    map((customNodeTemplate: TemplateRef<any>) =>
      isNullOrUndefined(customNodeTemplate) ? this.defaultNodeTemplate : customNodeTemplate
    )
  );

  public readonly trackBy$: Observable<TrackByFunction<FlatTreeItem>> = this.configuration$.pipe(
    map((configuration: TreeConfiguration) => configuration.trackBy)
  );
  public readonly dataSource$: Observable<DataSource<FlatTreeItem>> = this.notNilConfiguration$.pipe(
    map((configuration: TreeConfiguration) => configuration.dataSource)
  );
  public readonly treeControl$: Observable<FlatTreeControl<FlatTreeItem>> = this.notNilConfiguration$.pipe(
    map((configuration: TreeConfiguration) => configuration.treeControl)
  );
  public readonly dataOrigin$: Observable<TreeItem[]> | Observable<FlatTreeItem[]> = this.notNilConfiguration$.pipe(
    switchMap((configuration: TreeConfiguration) => configuration.dataOrigin$)
  );

  @Output() private readonly expandedNode: EventEmitter<FlatTreeItem> = new EventEmitter<FlatTreeItem>();

  constructor() {
    this.subscription.add(this.emitExpandedItemOnAction());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (
      isNullOrUndefined(changes) ||
      isNullOrUndefined(changes.configuration) ||
      isNullOrUndefined(changes.configuration.currentValue) ||
      !changes.configuration.isFirstChange()
    ) {
      return;
    }

    this.handleTreeConfiguration(this.configuration);
  }

  public ngAfterViewInit(): void {
    this.subscribeOnDataExtractionOnScrolling();
    this.refreshViewPort();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public toggleExpansion(node: FlatTreeItem): void {
    this.notNilConfiguration$
      .pipe(
        switchMap((configuration: TreeConfiguration) => configuration.expandedItemsIds$),
        map((expandedItemsIds: string[]) => expandedItemsIds.includes(node.id)),
        withLatestFrom(this.notNilConfiguration$),
        take(1)
      )
      .subscribe(([isExpanded, configuration]: [boolean, TreeConfiguration]) =>
        isExpanded ? configuration.markAsCollapsed(node) : configuration.markAsExpanded(node)
      );
  }

  private handleTreeConfiguration(configuration: TreeConfiguration): void {
    this.configuration$.next(configuration);
  }

  private refreshViewPort(): void {
    this.viewPort.checkViewportSize();
  }

  private subscribeOnDataExtractionOnScrolling(): void {
    const viewPortRerenderingSubscription: Subscription = this.viewPort.renderedRangeStream
      .pipe(skipUntil(this.notNilConfiguration$.pipe(take(1))))
      .subscribe((range: ListRange) => {
        const expandedTreeItems: FlatTreeItem[] = this.configuration.getExpandedFlatTreeItems();
        const someNodesAreExpanded: boolean = !Object.is(expandedTreeItems.length, 0);

        if (someNodesAreExpanded) {
          // return;
        }
        this.configuration.updateVisibleRange(range);
      });
    this.subscription.add(viewPortRerenderingSubscription);
  }

  private emitExpandedItemOnAction(): Subscription {
    return this.configuration$
      .pipe(
        filter((configuration: TreeConfiguration) => !isNullOrUndefined(configuration)),
        switchMap((configuration: TreeConfiguration) =>
          configuration.itemToExpand$.pipe(filter((item: FlatTreeItem) => !isNullOrUndefined(item)))
        )
      )
      .subscribe(item => this.expandedNode.emit(item));
  }

  public readonly hasChild = (_: number, node: FlatTreeItem): boolean => !isNullOrUndefined(node) && node.isExpandable;
  public readonly hasNoChild = (_: number, node: FlatTreeItem): boolean =>
    !isNullOrUndefined(node) && !node.isExpandable;
}

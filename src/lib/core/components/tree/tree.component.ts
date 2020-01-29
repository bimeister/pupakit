import { DataSource, ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
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

  @Input() public readonly configuration: TreeConfiguration;
  private readonly configuration$: BehaviorSubject<TreeConfiguration> = new BehaviorSubject<TreeConfiguration>(null);
  private readonly notNilConfiguration$: Observable<TreeConfiguration> = this.configuration$.pipe(
    filter(configuration => !isNullOrUndefined(configuration)),
    shareReplay(1)
  );

  public readonly dataSource$: Observable<DataSource<FlatTreeItem>> = this.notNilConfiguration$.pipe(
    map((configuration: TreeConfiguration) => configuration.dataSource)
  );
  public readonly treeControl$: Observable<FlatTreeControl<FlatTreeItem>> = this.notNilConfiguration$.pipe(
    map((configuration: TreeConfiguration) => configuration.treeControl)
  );
  public readonly dataOrigin$: Observable<TreeItem[]> | Observable<FlatTreeItem[]> = this.notNilConfiguration$.pipe(
    switchMap((configuration: TreeConfiguration) => configuration.getSourceData())
  );

  @HostListener('click')
  public processTreeClick(): void {
    // tslint:disable-next-line: no-console
    console.log(this.configuration.dataSource['flattenedData'].value);
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

  private handleTreeConfiguration(configuration: TreeConfiguration): void {
    this.configuration$.next(configuration);
  }

  private refreshViewPort(): void {
    this.viewPort.checkViewportSize();
  }

  private subscribeOnDataExtractionOnScrolling(): void {
    const viewPortRerenderingSubscription: Subscription = this.viewPort.renderedRangeStream
      .pipe(withLatestFrom(this.dataOrigin$), skipUntil(this.notNilConfiguration$.pipe(take(1))))
      .subscribe(([range, origin]: [ListRange, TreeItem[]]) => {
        const expandedTreeItems: FlatTreeItem[] = this.configuration.getExpandedFlatTreeItems();
        const someNodesAreExpanded: boolean = !Object.is(expandedTreeItems.length, 0);
        if (someNodesAreExpanded) {
          return;
        }
        this.configuration.setSourceData(origin.slice(range.start, range.end));
      });
    this.subscription.add(viewPortRerenderingSubscription);
  }

  public readonly hasChild = (_: number, node: FlatTreeItem): boolean => !isNullOrUndefined(node) && node.isExpandable;
  public readonly hasNoChild = (_: number, node: FlatTreeItem): boolean =>
    !isNullOrUndefined(node) && !node.isExpandable;
}

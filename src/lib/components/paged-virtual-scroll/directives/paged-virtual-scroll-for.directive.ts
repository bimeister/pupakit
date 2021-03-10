import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  ArrayDataSource,
  CollectionViewer,
  DataSource,
  ListRange,
  _RecycleViewRepeaterStrategy,
  _ViewRepeaterItemInsertArgs,
  _VIEW_REPEATER_STRATEGY
} from '@angular/cdk/collections';
import {
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Inject,
  Input,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgIterable,
  NgZone,
  OnChanges,
  OnDestroy,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef
} from '@angular/core';
import { filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import { delayWhen, filter, map, pairwise, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { ComponentChange } from '../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../internal/declarations/interfaces/component-changes.interface';
import { VirtualScrollViewportComponent } from '../../../../internal/declarations/interfaces/virtual-scroll-viewport-component.interface';
import { PagedVirtualScrollStateService } from '../services/paged-virtual-scroll-state.service';

type PupaVirtualForOfType<T> = T[];

interface UpdateContextArguments {
  needApplyDetectChanges: boolean;
}

interface CdkVirtualScrollRepeater<T> {
  dataStream: Observable<T[] | ReadonlyArray<T>>;
  measureRangeSize(range: ListRange, orientation: 'horizontal' | 'vertical'): number;
}

/** The context for an item rendered by `PupaVirtualScrollForOf` */
interface PupaVirtualScrollForOfContext<T> {
  /** The item value. */
  $implicit: T;
  /** The DataSource, Observable, or NgIterable that was passed to *cdkVirtualFor. */
  cdkVirtualForOf: DataSource<T> | Observable<T[]> | NgIterable<T>;
  /** The index of the item in the DataSource. */
  index: number;
  /** The number of items in the DataSource. */
  count: number;
  /** Whether this is the first item in the DataSource. */
  first: boolean;
  /** Whether this is the last item in the DataSource. */
  last: boolean;
  /** Whether the index is even. */
  even: boolean;
  /** Whether the index is odd. */
  odd: boolean;
}

/** Helper to extract the offset of a DOM Node in a certain direction. */
function getOffset(orientation: 'horizontal' | 'vertical', direction: 'start' | 'end', node: Node): number {
  const el: Element = node as Element;
  if (!el.getBoundingClientRect) {
    return 0;
  }
  const rect: ClientRect = el.getBoundingClientRect();

  if (orientation === 'horizontal') {
    return direction === 'start' ? rect.left : rect.right;
  }

  return direction === 'start' ? rect.top : rect.bottom;
}

@Directive({
  selector: '[pupaVirtualFor][pupaVirtualForOf]',
  providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }]
})
export class PupaVirtualScrollForDirective<T>
  implements CdkVirtualScrollRepeater<T>, CollectionViewer, OnChanges, DoCheck, OnDestroy {
  /** The DataSource to display. */
  @Input() public pupaVirtualForOf: PupaVirtualForOfType<T>;
  private readonly pupaVirtualForOf$: BehaviorSubject<PupaVirtualForOfType<T>> = new BehaviorSubject<
    PupaVirtualForOfType<T>
  >(null);

  /**
   * The `TrackByFunction` to use for tracking changes. The `TrackByFunction` takes the index and
   * the item and produces a value to be used as the item's identity when tracking changes.
   */
  @Input() public trackByFunction: TrackByFunction<T> | undefined;
  private readonly trackByFunction$: BehaviorSubject<TrackByFunction<T> | undefined> = new BehaviorSubject<
    TrackByFunction<T> | undefined
  >(null);

  /** The template used to stamp out new elements. */
  @Input() public template: TemplateRef<PupaVirtualScrollForOfContext<T>> = this.hostTemplate;
  private readonly template$: BehaviorSubject<TemplateRef<PupaVirtualScrollForOfContext<T>>> = new BehaviorSubject<
    TemplateRef<PupaVirtualScrollForOfContext<T>>
  >(this.hostTemplate);

  /**
   * Whether the rendered data should be updated during the next ngDoCheck cycle.
   * Emit when trackByFunction change to recalculate differ
   * */
  private readonly needsUpdate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * @deprecated Angular shit: no $-naming 🤡
   * Emits when the rendered view of the data changes.
   * */
  public readonly viewChange: Subject<ListRange> = new Subject<ListRange>();

  /** Subject that emits when a new DataSource instance is given. */
  private readonly dataSourceChanges$: BehaviorSubject<Nullable<DataSource<T>>> = new BehaviorSubject<
    Nullable<DataSource<T>>
  >(null);

  /**
   * @deprecated Angular shit: no $-naming 🤡
   * Emits whenever the data in the current DataSource changes.
   * */
  public dataStream: Observable<T[] | ReadonlyArray<T>> = this.dataSourceChanges$.pipe(
    // Bundle up the previous and current data sources so we can work with both.
    pairwise(),
    // Use `_changeDataSource` to disconnect from the previous data source and connect to the
    // new one, passing back a stream of data changes which we run through `switchMap` to give
    // us a data stream that emits the latest data from whatever the current `DataSource` is.
    switchMap(([prevDataSource, currentDataSource]: [DataSource<T>, DataSource<T>]) =>
      this.changeDataSource(prevDataSource, currentDataSource)
    ),
    // Replay the last emitted data when someone subscribes.
    shareReplayWithRefCount()
  );

  /** The differ used to calculate changes to the data. */
  private readonly differ$: BehaviorSubject<IterableDiffer<T> | null> = new BehaviorSubject<IterableDiffer<T> | null>(
    null
  );

  /** The most recent data emitted from the DataSource. */
  private readonly data$: BehaviorSubject<T[] | ReadonlyArray<T>> = new BehaviorSubject<T[] | ReadonlyArray<T>>(null);

  /** The currently rendered items. */
  private readonly renderedItems$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  private readonly viewport$: BehaviorSubject<VirtualScrollViewportComponent> = this.pagedVirtualScrollStateService
    .viewport$;
  private readonly calculatedCacheSize$: BehaviorSubject<number> = this.pagedVirtualScrollStateService
    .calculatedCacheSize$;

  private readonly totalCount$: BehaviorSubject<number> = this.pagedVirtualScrollStateService.totalCount$;
  private readonly countItemsInViewport$: BehaviorSubject<number> = this.pagedVirtualScrollStateService
    .countItemsInViewport$;

  /** The currently rendered range of indices. */
  private _renderedRange: ListRange;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    /** The view container to add items to. */
    private readonly viewContainerRef: ViewContainerRef,
    /** The template to use when stamping out new items. */
    private readonly hostTemplate: TemplateRef<PupaVirtualScrollForOfContext<T>>,
    /** The set of available differs. */
    private readonly differs: IterableDiffers,
    /** The strategy used to render items in the virtual scroll viewport. */
    @Inject(_VIEW_REPEATER_STRATEGY)
    private readonly viewRepeater: _RecycleViewRepeaterStrategy<T, T, PupaVirtualScrollForOfContext<T>>,
    private readonly ngZone: NgZone,
    private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService
  ) {
    this.subscription
      .add(this.processDataStreamChanges())
      .add(this.processViewportRangeSizeChanges())
      .add(this.processViewportResizingForChangeCacheSize())
      .add(this.processIsNilTasksCount());

    this.attachViewport();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processPupaVirtualForOfChange(changes?.pupaVirtualForOf);
    this.processTrackByFunctionChange(changes?.trackByFunction);
    this.processTemplateChange(changes?.template);
  }

  public ngDoCheck(): void {
    this.processNeedApplyChangesOrUpdateContext();
  }

  public ngOnDestroy(): void {
    this.detachViewport();

    this.dataSourceChanges$.next(undefined);
    this.dataSourceChanges$.complete();
    this.viewChange.complete();

    this.viewRepeater.detach();

    this.subscription.unsubscribe();
  }

  /**
   * Measures the combined size (width for horizontal orientation, height for vertical) of all items
   * in the specified range. Throws an error if the range includes items that are not currently
   * rendered.
   */
  public measureRangeSize(range: ListRange, orientation: 'horizontal' | 'vertical'): number {
    if (range.start >= range.end) {
      return 0;
    }
    if (range.start < this._renderedRange.start || range.end > this._renderedRange.end) {
      throw Error(`Error: attempted to measure an item that isn't rendered.`);
    }

    // The index into the list of rendered views for the first item in the range.
    const renderedStartIndex: number = range.start - this._renderedRange.start;
    // The length of the range we're measuring.
    const rangeLen: number = range.end - range.start;

    // Loop over all the views, find the first and land node and compute the size by subtracting
    // the top of the first node from the bottom of the last one.
    let firstNode: HTMLElement | undefined;
    let lastNode: HTMLElement | undefined;

    // Find the first node by starting from the beginning and going forwards.
    for (let i: number = 0; i < rangeLen; i++) {
      const view: EmbeddedViewRef<
        PupaVirtualScrollForOfContext<T>
      > | null = this.getViewFromViewContainerAsEmbeddedViewRef(i + renderedStartIndex);
      if (view && view.rootNodes.length) {
        firstNode = lastNode = view.rootNodes[0];
        break;
      }
    }

    // Find the last node by starting from the end and going backwards.
    for (let i: number = rangeLen - 1; i > -1; i--) {
      const view: EmbeddedViewRef<
        PupaVirtualScrollForOfContext<T>
      > | null = this.getViewFromViewContainerAsEmbeddedViewRef(i + renderedStartIndex);
      if (view && view.rootNodes.length) {
        lastNode = view.rootNodes[view.rootNodes.length - 1];
        break;
      }
    }

    return firstNode && lastNode
      ? getOffset(orientation, 'end', lastNode) - getOffset(orientation, 'start', firstNode)
      : 0;
  }

  private attachViewport(): void {
    this.viewport$
      .pipe(filterNotNil(), take(1))
      .subscribe((viewport: VirtualScrollViewportComponent) => viewport.attach(this));
  }

  private detachViewport(): void {
    this.viewport$
      .pipe(filterNotNil(), take(1))
      .subscribe((viewport: VirtualScrollViewportComponent) => viewport.detach());
  }

  /** React to scroll state changes in the viewport. */
  private onRenderedDataChange(): void {
    this.data$
      .pipe(
        filterNotNil(),
        filter(() => !isNil(this._renderedRange)),
        withLatestFrom(this.trackByFunction$, this.differ$, this.pupaVirtualForOf$)
      )
      .subscribe(
        ([data, trackByFunction, differ, _pupaVirtualForOf]: [
          T[] | ReadonlyArray<T>,
          TrackByFunction<T> | undefined,
          IterableDiffer<T> | null,
          T[]
        ]) => {
          const renderedItems: T[] = data.slice(this._renderedRange.start, this._renderedRange.end);
          this.renderedItems$.next(renderedItems);
          this.needsUpdate$.next(true);

          if (!isNil(differ)) {
            return;
          }
          // Use a wrapper function for the `trackBy` so any new values are
          // picked up automatically without having to recreate the differ.
          const newDiffer: IterableDiffer<T> = this.differs.find(renderedItems).create((index: number, item: T) => {
            return isNil(trackByFunction) ? item : trackByFunction(index, item);
          });

          this.differ$.next(newDiffer);
        }
      );
  }

  /** Swap out one `DataSource` for another. */
  private changeDataSource(
    oldDataSource: DataSource<T> | null,
    newDataSource: DataSource<T> | null
  ): Observable<T[] | ReadonlyArray<T>> {
    if (oldDataSource) {
      oldDataSource.disconnect(this);
    }

    this.needsUpdate$.next(true);
    return newDataSource ? newDataSource.connect(this) : observableOf();
  }

  /** Update the `CdkVirtualForOfContext` for all views. */
  private updateContext({ needApplyDetectChanges }: UpdateContextArguments = { needApplyDetectChanges: true }): void {
    this.data$.pipe(filterNotNil(), take(1)).subscribe((data: T[] | ReadonlyArray<T>) => {
      const count: number = data.length;
      const viewContainerLength: number = this.viewContainerRef.length;

      Array(viewContainerLength)
        .fill(undefined)
        .forEach((_item: undefined, indexInViewContainer: number) => {
          const view: EmbeddedViewRef<
            PupaVirtualScrollForOfContext<T>
          > = this.getViewFromViewContainerAsEmbeddedViewRef(indexInViewContainer);
          view.context.index = this._renderedRange.start + indexInViewContainer;
          view.context.count = count;
          this.updateComputedContextProperties(view.context);

          if (needApplyDetectChanges) {
            view.detectChanges();
          }
        });
    });
  }

  /** Apply changes to the DOM. */
  private applyChanges(changes: IterableChanges<T>): void {
    this.pupaVirtualForOf$
      .pipe(
        filterNotNil(),
        take(1),
        delayWhen(() => this.calculatedCacheSize$.pipe(filterNotNil()))
      )
      .subscribe((pupaVirtualForOf: PupaVirtualForOfType<T>) => {
        this.viewRepeater.applyChanges(
          changes,
          this.viewContainerRef,
          (record: IterableChangeRecord<T>, _adjustedPreviousIndex: number | null, currentIndex: number | null) =>
            this.getEmbeddedViewArgs(record, currentIndex, pupaVirtualForOf),
          record => record.item
        );

        // Update $implicit for any items that had an identity change.
        changes.forEachIdentityChange((record: IterableChangeRecord<T>) => {
          const view: EmbeddedViewRef<
            PupaVirtualScrollForOfContext<T>
          > | null = this.getViewFromViewContainerAsEmbeddedViewRef(record.currentIndex);
          view.context.$implicit = record.item;
        });

        // Update the context variables on all items.
        this.updateContext({ needApplyDetectChanges: false });
      });
  }

  /** Update the computed properties on the `CdkVirtualForOfContext`. */
  private updateComputedContextProperties(context: PupaVirtualScrollForOfContext<T>): void {
    context.first = context.index === 0;
    context.last = context.index === context.count - 1;
    context.even = context.index % 2 === 0;
    context.odd = !context.even;
  }

  private getEmbeddedViewArgs(
    record: IterableChangeRecord<T>,
    index: number,
    pupaVirtualForOf: PupaVirtualForOfType<T>
  ): _ViewRepeaterItemInsertArgs<PupaVirtualScrollForOfContext<T>> {
    // Note that it's important that we insert the item directly at the proper index,
    // rather than inserting it and the moving it in place, because if there's a directive
    // on the same node that injects the `ViewContainerRef`, Angular will insert another
    // comment node which can throw off the move when it's being repeated for all items.
    return {
      templateRef: this.hostTemplate,
      context: {
        $implicit: record.item,
        cdkVirtualForOf: pupaVirtualForOf,
        index: -1,
        count: -1,
        first: false,
        last: false,
        odd: false,
        even: false
      },
      index
    };
  }

  private processViewportRangeSizeChanges(): Subscription {
    return this.viewport$
      .pipe(
        filterNotNil(),
        switchMap((viewport: any) => viewport.renderedRangeStream)
      )
      .subscribe((range: ListRange) => {
        this._renderedRange = range;
        this.ngZone.run(() => this.viewChange.next(this._renderedRange));
        this.onRenderedDataChange();
      });
  }

  private processDataStreamChanges(): Subscription {
    return this.dataStream.subscribe((data: T[] | ReadonlyArray<T>) => {
      this.data$.next(data);
      this.onRenderedDataChange();
    });
  }

  private processNeedApplyChangesOrUpdateContext(): void {
    combineLatest([this.differ$, this.needsUpdate$])
      .pipe(
        take(1),
        filter(([differ, needsUpdate]: [IterableDiffer<T> | null, boolean]) => !isNil(differ) && needsUpdate),
        withLatestFrom(this.renderedItems$)
      )
      .subscribe(([[differ, _needsUpdate], renderedItems]: [[IterableDiffer<T> | null, boolean], T[]]) => {
        const changes: IterableChanges<T> = differ.diff(renderedItems);

        changes ? this.applyChanges(changes) : this.updateContext();
        this.needsUpdate$.next(false);
      });
  }

  private processViewportResizingForChangeCacheSize(): Subscription {
    return this.calculatedCacheSize$
      .pipe(
        filterNotNil(),
        map((cacheSize: number) => coerceNumberProperty(cacheSize))
      )
      .subscribe((cacheSize: number) => (this.viewRepeater.viewCacheSize = cacheSize));
  }

  private processIsNilTasksCount(): Subscription {
    return this.totalCount$
      .pipe(
        filter((totalCount: number) => isNil(totalCount)),
        withLatestFrom(this.countItemsInViewport$.pipe(filterNotNil()))
      )
      .subscribe(([_totalCount, countItemsInViewport]: [Nullable<number>, number]) => {
        const emptyAddBlocksEqualCountItemsInViewport: T[] = Array(countItemsInViewport).fill(null);
        const serializedDataSourceForDisplay: ArrayDataSource<T> = new ArrayDataSource<T>(
          emptyAddBlocksEqualCountItemsInViewport
        );
        this.dataSourceChanges$.next(serializedDataSourceForDisplay);
        this.pupaVirtualForOf$.next(emptyAddBlocksEqualCountItemsInViewport);
      });
  }

  private processPupaVirtualForOfChange(change: ComponentChange<this, PupaVirtualForOfType<T>>): void {
    this.totalCount$.pipe(filterNotNil()).subscribe((totalCount: number) => {
      const updatedPupaVirtualForData: PupaVirtualForOfType<T> | undefined = change?.currentValue;

      if (!Array.isArray(updatedPupaVirtualForData)) {
        throw new Error(`[PupaVirtualScrollForDirective] data must be a Array.`);
      }

      const dataLengthDiff: number = Math.max(totalCount - updatedPupaVirtualForData.length, 0);
      const emptyAddBlocks: T[] = Array(dataLengthDiff).fill(null);

      const totalData: T[] = [...updatedPupaVirtualForData, ...emptyAddBlocks];

      const serializedDataSource: ArrayDataSource<T> = new ArrayDataSource<T>(totalData);
      this.dataSourceChanges$.next(serializedDataSource);
      this.pupaVirtualForOf$.next(totalData);
      this.updateContext({ needApplyDetectChanges: true });
    });
  }

  private processTrackByFunctionChange(change: ComponentChange<this, TrackByFunction<T> | undefined>): void {
    const updatedTrackByFunction: TrackByFunction<T> | undefined = change?.currentValue;

    if (!isNil(updatedTrackByFunction) && typeof updatedTrackByFunction !== 'function') {
      throw new Error(`[PupaVirtualScrollForDirective] trackBy must be a function.`);
    }

    const startIndex: number = isNil(this._renderedRange) ? 0 : this._renderedRange.start;

    const serializedTrackByFunction: TrackByFunction<T> | undefined = updatedTrackByFunction
      ? (index, item) => updatedTrackByFunction(index + startIndex, item)
      : undefined;

    this.trackByFunction$.next(serializedTrackByFunction);
    this.needsUpdate$.next(true);
  }

  private processTemplateChange(change: ComponentChange<this, TemplateRef<PupaVirtualScrollForOfContext<T>>>): void {
    const updatedValue: TemplateRef<PupaVirtualScrollForOfContext<T>> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.template$.next(this.template);
  }

  /** @deprecated Angular type shit 🤡  */
  private getViewFromViewContainerAsEmbeddedViewRef(index: number): EmbeddedViewRef<PupaVirtualScrollForOfContext<T>> {
    return this.viewContainerRef.get(index) as EmbeddedViewRef<PupaVirtualScrollForOfContext<T>>;
  }

  public static ngTemplateContextGuard<T>(_dir: any, _ctx: any): _ctx is PupaVirtualScrollForOfContext<T> {
    return true;
  }
}

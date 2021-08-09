import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  TemplateRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewChild,
  TrackByFunction,
  AfterViewInit,
  ElementRef,
  NgZone,
  Renderer2
} from '@angular/core';
import { TableTemplatesService } from '../../services/table-templates.service';
import {
  animationFrameScheduler,
  BehaviorSubject,
  combineLatest,
  fromEvent,
  merge,
  Observable,
  Subscription
} from 'rxjs';
import { BusEventBase, EventBus } from '@bimeister/event-bus';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { distinctUntilChanged, map, observeOn, subscribeOn, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TableColumnsIntersectionService } from '../../services/table-columns-intersection.service';
import { TableHeaderCellContext } from '../../../../../internal/declarations/interfaces/table-header-cell-context.interface';
import { TableBodyCellContext } from '../../../../../internal/declarations/interfaces/table-body-cell-context.interface';
import { TableController } from '../../../../../internal/declarations/classes/table-controller.class';
import { TableDataDisplayCollectionRef } from '../../../../../internal/declarations/interfaces/table-data-display-collection-ref.interface';
import { TableBodyRowsDataSource } from '../../../../../internal/declarations/classes/table-body-rows-data-source.class';
import { TableColumn } from '../../../../../internal/declarations/classes/table-column.class';
import { TableBodyRow } from '../../../../../internal/declarations/classes/table-body-row.class';
import { TableRow } from '../../../../../internal/declarations/classes/table-row.class';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { isTableCellHtmlElement } from '../../../../../internal/type-guards/is-table-cell-html-element.type-guard';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { TableEvents } from '../../../../../internal/declarations/events/table.events';
import { TableColumnSorting } from '../../../../../internal/declarations/enums/table-column-sorting.enum';
import { DataEvents } from '../../../../../internal/declarations/events/data.events';
import { UiState } from '../../../../../internal/declarations/interfaces/ui-state.interface';
import { QueueEvents } from '../../../../../internal/declarations/events/queue.events';
import { TableScrollbarsService } from '../../services/table-scrollbars.service';
import { TableCellHtmlElementDataset } from '../../../../../internal/declarations/interfaces/table-cell-html-element-dataset.interface';

function getCellDataFromEvent(event: Event): TableCellHtmlElementDataset {
  const targetPath: EventTarget[] = event.composedPath();

  let rowId: string = null;
  let columnId: string = null;

  for (const target of targetPath) {
    if (!isTableCellHtmlElement(target)) {
      continue;
    }
    rowId = target.dataset.rowId;
    columnId = target.dataset.columnId;
  }

  return { rowId, columnId };
}

@Component({
  selector: 'pupa-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableTemplatesService, TableColumnsIntersectionService, TableScrollbarsService]
})
export class TableComponent<T> implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @ViewChild('table', { static: true })
  public tableRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('defaultHeaderCellTemplate', { static: true })
  public defaultHeaderCellTemplateRef?: Nullable<TemplateRef<TableHeaderCellContext>>;

  @ViewChild('defaultBodyCellTemplate', { static: true })
  public defaultBodyCellTemplateRef?: Nullable<TemplateRef<TableBodyCellContext<T>>>;

  @ViewChild('cdkVirtualScrollViewport', { static: true })
  public cdkVirtualScrollViewportRef: Nullable<CdkVirtualScrollViewport>;

  @ViewChild('headerScollableRowsContainer', { static: true })
  public headerScollableRowsContainerRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('decorScollableRowsContainer', { static: true })
  public decorScollableRowsContainerRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('bodyScollableRowsContainer', { static: true })
  public bodyScollableRowsContainerRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('placeholderScollableRowsContainer', { static: true })
  public placeholderScollableRowsContainerRef?: Nullable<ElementRef<HTMLElement>>;

  @Input() public controller: TableController<T>;
  private readonly controller$: BehaviorSubject<Nullable<TableController<T>>> = new BehaviorSubject<TableController<T>>(
    null
  );
  private readonly availableContoller$: Observable<TableController<T>> = this.controller$.pipe(filterNotNil());

  public isVerticalScrollBarVisible$: Observable<boolean> = this.tableScrollbarsService.isVerticalVisible$;
  public isHorizontalScrollBarVisible$: Observable<boolean> = this.tableScrollbarsService.isHorizontalVisible$;

  private readonly dataDisplayCollection$: Observable<TableDataDisplayCollectionRef<T>> = this.availableContoller$.pipe(
    map((controller: TableController<T>) => controller.getDataDisplayCollectionRef())
  );

  public readonly data$: Observable<T[]> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.data$)
  );

  public readonly rowHeightPx$: Observable<number> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.rowHeightPx$)
  );

  public readonly virtualScrollDataSource$: Observable<TableBodyRowsDataSource<T>> = this.dataDisplayCollection$.pipe(
    map((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.virtualScrollDataSource)
  );

  private readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.columnIdToColumnMap$)
  );

  public readonly pinnedLeftColumns$: Observable<TableColumn[]> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.pinnedLeftColumns$)
  );

  public readonly scrollableColumns$: Observable<TableColumn[]> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.scrollableColumns$)
  );

  public readonly pinnedRightColumns$: Observable<TableColumn[]> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.pinnedRightColumns$)
  );

  private readonly bodyRowIdToBodyRowMap$: Observable<Map<string, TableBodyRow<T>>> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.bodyRowIdToBodyRowMap$)
  );

  public readonly rows$: Observable<TableBodyRow<T>[]> = this.bodyRowIdToBodyRowMap$.pipe(
    map((bodyRowIdToBodyRowMap: Map<string, TableBodyRow<T>>) => Array.from(bodyRowIdToBodyRowMap.values()))
  );

  public headerRow$: Observable<TableRow> = this.dataDisplayCollection$.pipe(
    map((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.headerRow)
  );

  public readonly placeholderRow$: Observable<TableRow> = this.dataDisplayCollection$.pipe(
    map((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.placeholderRow)
  );

  public trackBy$: Observable<TrackByFunction<T>> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.trackBy$)
  );

  public scrollBehavior$: Observable<ScrollBehavior> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.scrollBehavior$)
  );

  public eventBus$: Observable<EventBus> = this.availableContoller$.pipe(
    map((controller: TableController<T>) => controller.eventBus)
  );

  public leftHiddenColumnsCount$: Observable<number> = this.tableColumnsIntersectionService.leftHiddenColumnIds$.pipe(
    map((leftHiddenColumnIds: string[]) => leftHiddenColumnIds.length)
  );

  public rightHiddenColumnsCount$: Observable<number> = this.tableColumnsIntersectionService.rightHiddenColumnIds$.pipe(
    map((rightHiddenColumnIds: string[]) => rightHiddenColumnIds.length)
  );
  constructor(
    private readonly tableTemplatesService: TableTemplatesService<T>,
    public readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly tableColumnsIntersectionService: TableColumnsIntersectionService,
    private readonly tableScrollbarsService: TableScrollbarsService,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2
  ) {}

  public readonly rowTrackByFunction: TrackByFunction<TableBodyRow<T>> = (index: number, _item: TableBodyRow<T>) =>
    index;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processTableControllerChanges(changes.controller);
  }

  public ngOnInit(): void {
    this.setCdkVirtualScrollContentWrapperWidth();
    this.registerDefaultTemplates();

    this.subscription.add(this.setColumnsBreakpointOnCurrentBreakpointChanges());
    this.subscription.add(this.processListRangeChanges());
    this.subscription.add(this.processLeftHiddenColumnIdsChanges());
    this.subscription.add(this.processColumnWidthChanges());
    this.subscription.add(this.processColumnSortingChanges());
    this.subscription.add(this.processScrollViewportEvent());
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.updateDataTableWidthOnWindowResize());
    this.subscription.add(this.checkVerticalScrollBarVisibilityOnDataChanges());
    this.subscription.add(this.checkHorizontalScrollBarVisibilityOnColumnsChangesOrContentResize());

    this.startEventsQueue();
    this.processScollableRowsHorizontalScroll();
    this.registrerHeaderScrollableContainerForIntersectionDetection();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processTableMouseEvent(event: MouseEvent): void {
    combineLatest([this.columnIdToColumnMap$, this.bodyRowIdToBodyRowMap$, this.eventBus$])
      .pipe(take(1))
      .subscribe(
        ([columnIdToColumnMap, bodyRowIdToBodyRowMap, eventBus]: [
          Map<string, TableColumn>,
          Map<string, TableBodyRow<T>>,
          EventBus
        ]) => {
          for (const column of columnIdToColumnMap.values()) {
            column.isHovered$.next(false);
          }
          for (const row of bodyRowIdToBodyRowMap.values()) {
            row.isHovered$.next(false);
          }

          const { rowId, columnId }: TableCellHtmlElementDataset = getCellDataFromEvent(event);

          if (isNil(rowId) || isNil(columnId)) {
            eventBus.dispatch(new TableEvents.RowHover(null));
            eventBus.dispatch(new TableEvents.ColumnHover(null));
            return;
          }

          columnIdToColumnMap.get(columnId)?.isHovered$?.next(true);
          bodyRowIdToBodyRowMap.get(rowId)?.isHovered$?.next(true);

          eventBus.dispatch(new TableEvents.RowHover(rowId));
          eventBus.dispatch(new TableEvents.ColumnHover(columnId));
        }
      );
  }

  public processTap(event: HammerInput): void {
    const { rowId, columnId }: TableCellHtmlElementDataset = getCellDataFromEvent(event.srcEvent);

    if (isNil(rowId) || isNil(columnId)) {
      return;
    }

    this.eventBus$.pipe(take(1)).subscribe((eventBus: EventBus) => {
      eventBus.dispatch(new TableEvents.CellClick(columnId, rowId));
    });
  }

  private processTableControllerChanges(change: ComponentChange<this, TableController<T>>): void {
    const value: TableController<T> = change?.currentValue;
    if (isNil(value)) {
      return;
    }
    this.controller$.next(value);
  }

  /**
   * @description
   * Angular shit: 🦯🤡 content need max width from table element.
   * Use this method instead of :ng-deep
   */
  private setCdkVirtualScrollContentWrapperWidth(): void {
    const cdkVitrualScrollElement: HTMLElement = this.cdkVirtualScrollViewportRef.elementRef.nativeElement;
    if (!(cdkVitrualScrollElement.firstChild instanceof HTMLElement)) {
      return;
    }
    const cdkVirtualScrollContentWrapperElement: HTMLElement = cdkVitrualScrollElement.firstChild;
    this.renderer.setStyle(cdkVirtualScrollContentWrapperElement, 'width', '100%');
  }

  private registerDefaultTemplates(): void {
    this.tableTemplatesService.registerDefaultTemplates({
      headerCell: this.defaultHeaderCellTemplateRef,
      bodyCell: this.defaultBodyCellTemplateRef
    });
  }

  private setColumnsBreakpointOnCurrentBreakpointChanges(): Subscription {
    return combineLatest([this.clientUiStateHandlerService.breakpoint$, this.columnIdToColumnMap$]).subscribe(
      ([currentBreakpoint, columnIdToColumnMap]: [string, Map<string, TableColumn>]) => {
        for (const column of columnIdToColumnMap.values()) {
          column.breakpoint$.next(currentBreakpoint);
        }
      }
    );
  }

  private processListRangeChanges(): Subscription {
    return this.virtualScrollDataSource$
      .pipe(
        take(1),
        switchMap((virtualScrollDataSource: TableBodyRowsDataSource<T>) => virtualScrollDataSource.listRange$),
        withLatestFrom(this.eventBus$)
      )
      .subscribe(([listRange, eventBus]: [ListRange, EventBus]) =>
        eventBus.dispatch(new TableEvents.ListRangeChanged(listRange))
      );
  }

  private processLeftHiddenColumnIdsChanges(): Subscription {
    return combineLatest([
      this.tableColumnsIntersectionService.leftHiddenColumnIds$,
      this.tableColumnsIntersectionService.rightHiddenColumnIds$
    ])
      .pipe(withLatestFrom(this.eventBus$))
      .subscribe(([[leftHiddenColumnIds, rightHiddenColumnIds], eventBus]: [[string[], string[]], EventBus]) =>
        eventBus.dispatch(new TableEvents.HiddenColumnIdsChanged(leftHiddenColumnIds, rightHiddenColumnIds))
      );
  }

  private processColumnWidthChanges(): Subscription {
    return this.columnIdToColumnMap$
      .pipe(
        switchMap((columnIdToColumnMap: Map<string, TableColumn>) => {
          const columnWidthChangesList: Observable<[string, number]>[] = Array.from(
            columnIdToColumnMap.values()
          ).map((column: TableColumn) =>
            column.widthPx$.pipe(map((widthPx: number) => [column.definition.id, widthPx]))
          );

          return merge(...columnWidthChangesList);
        }),
        observeOn(animationFrameScheduler),
        withLatestFrom(this.eventBus$)
      )
      .subscribe(([[columnId, widthPx], eventBus]: [[string, number], EventBus]) => {
        eventBus.dispatch(new TableEvents.ColumnWidthChanged(widthPx, columnId));
      });
  }

  private processColumnSortingChanges(): Subscription {
    return this.columnIdToColumnMap$
      .pipe(
        switchMap((columnIdToColumnMap: Map<string, TableColumn>) => {
          const columnWidthChangesList: Observable<[string, TableColumnSorting]>[] = Array.from(
            columnIdToColumnMap.values()
          ).map((column: TableColumn) =>
            column.sorting$.pipe(map((sorting: TableColumnSorting) => [column.definition.id, sorting]))
          );

          return merge(...columnWidthChangesList);
        }),
        withLatestFrom(this.eventBus$)
      )
      .subscribe(([[columnId, sorting], eventBus]: [[string, TableColumnSorting], EventBus]) => {
        eventBus.dispatch(new TableEvents.ColumnSortingChanged(sorting, columnId));
      });
  }

  private processScrollViewportEvent(): Subscription {
    return this.eventBus$
      .pipe(
        switchMap((eventBus: EventBus) =>
          eventBus.catchEvents((event: BusEventBase) => event instanceof DataEvents.ScrollViewport)
        ),
        withLatestFrom(this.scrollBehavior$)
      )
      .subscribe(([event, scrollBehavior]: [DataEvents.ScrollViewport, ScrollBehavior]) => {
        this.cdkVirtualScrollViewportRef.scrollToIndex(event.payload, scrollBehavior);
      });
  }

  private updateDataTableWidthOnWindowResize(): Subscription {
    return this.clientUiStateHandlerService.uiState$
      .pipe(
        map((uiState: UiState) => uiState.windowWidth),
        distinctUntilChanged(),
        map(() => this.tableRef.nativeElement.clientWidth),
        withLatestFrom(this.dataDisplayCollection$)
      )
      .subscribe(([tableWidthPx, dataDisplayCollection]: [number, TableDataDisplayCollectionRef<T>]) => {
        dataDisplayCollection.setTableWidthPx(tableWidthPx);
      });
  }

  private checkVerticalScrollBarVisibilityOnDataChanges(): Subscription {
    return this.data$
      .pipe(
        observeOn(animationFrameScheduler),
        subscribeOn(animationFrameScheduler),
        switchMap(() => this.eventBus$.pipe(take(1)))
      )
      .subscribe((eventBus: EventBus) => {
        const cdkVitrualScrollElement: HTMLElement = this.cdkVirtualScrollViewportRef.elementRef.nativeElement;
        const isVisible: boolean = cdkVitrualScrollElement.clientHeight < cdkVitrualScrollElement.scrollHeight;
        this.tableScrollbarsService.isVerticalVisible$.next(isVisible);
        eventBus.dispatch(new TableEvents.VerticalScrollBarVisibilityChanged(isVisible));
      });
  }

  private checkHorizontalScrollBarVisibilityOnColumnsChangesOrContentResize(): Subscription {
    return merge(
      this.columnIdToColumnMap$,
      this.clientUiStateHandlerService.uiState$,
      this.controller.getEvents(TableEvents.ColumnWidthChanged)
    )
      .pipe(
        observeOn(animationFrameScheduler),
        subscribeOn(animationFrameScheduler),
        switchMap(() => this.eventBus$.pipe(take(1)))
      )
      .subscribe((eventBus: EventBus) => {
        const scrollableHeaderElement: HTMLElement = this.headerScollableRowsContainerRef.nativeElement;
        const isVisible: boolean = scrollableHeaderElement.clientWidth < scrollableHeaderElement.scrollWidth;
        this.tableScrollbarsService.isHorizontalVisible$.next(isVisible);
        eventBus.dispatch(new TableEvents.HorizontalScrollBarVisibilityChanged(isVisible));
      });
  }

  private startEventsQueue(): void {
    this.eventBus$.pipe(take(1)).subscribe((eventBus: EventBus) => {
      eventBus.dispatch(new QueueEvents.StartQueue());
    });
  }

  private processScollableRowsHorizontalScroll(): void {
    this.ngZone.runOutsideAngular(() => {
      this.subscription.add(
        merge(
          fromEvent(this.bodyScollableRowsContainerRef.nativeElement, 'scroll'),
          fromEvent(this.placeholderScollableRowsContainerRef.nativeElement, 'scroll')
        ).subscribe((event: Event) => this.processBodyScroll(event))
      );
    });
  }

  private processBodyScroll(event: Event): void {
    const target: EventTarget = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const scrollLeft: number = target.scrollLeft;
    this.headerScollableRowsContainerRef.nativeElement.scrollLeft = scrollLeft;
    this.decorScollableRowsContainerRef.nativeElement.scrollLeft = scrollLeft;
    this.bodyScollableRowsContainerRef.nativeElement.scrollLeft = scrollLeft;
    this.placeholderScollableRowsContainerRef.nativeElement.scrollLeft = scrollLeft;
  }

  private registrerHeaderScrollableContainerForIntersectionDetection(): void {
    const headerScrollableRowsContainer: HTMLElement = this.headerScollableRowsContainerRef.nativeElement;
    this.tableColumnsIntersectionService.registerScrollArea(headerScrollableRowsContainer);
  }
}

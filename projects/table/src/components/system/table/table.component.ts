import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import {
  BusEventBase,
  ClientUiStateHandlerService,
  ComponentChange,
  ComponentChanges,
  QueueEvents,
} from '@bimeister/pupakit.common';
import { DndDropData, DndMoveData, DndSettings } from '@bimeister/pupakit.dnd';
import { ScrollableComponent } from '@bimeister/pupakit.kit';
import { filterByInstanceOf, filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { TableBodyRow } from '../../../declarations/classes/table-body-row.class';
import { TableBodyRowsDataSource } from '../../../declarations/classes/table-body-rows-data-source.class';
import { TableColumn } from '../../../declarations/classes/table-column.class';
import { TableController } from '../../../declarations/classes/table-controller.class';
import { TableCommonFeature } from '../../../declarations/classes/table-internal-system-features/table-common-feature.class';
import { TableDndFeature } from '../../../declarations/classes/table-internal-system-features/table-dnd-feature.class';
import { TableHoverFeature } from '../../../declarations/classes/table-internal-system-features/table-hover-feature.class';
import { TableResizeFeature } from '../../../declarations/classes/table-internal-system-features/table-resize-feature.class';
import { TableScrollFeature } from '../../../declarations/classes/table-internal-system-features/table-scroll-feature.class';
import { TableRow } from '../../../declarations/classes/table-row.class';
import { TableRowType } from '../../../declarations/enums/table-row-type.enum';
import { TableEvents } from '../../../declarations/events/table.events';
import { TableApi } from '../../../declarations/interfaces/table-api.interface';
import { TableBodyCellContext } from '../../../declarations/interfaces/table-body-cell-context.interface';
import { TableCellHtmlElementDataset } from '../../../declarations/interfaces/table-cell-html-element-dataset.interface';
import { TableCellHtmlElement } from '../../../declarations/interfaces/table-cell-html-element.interface';
import { TableDataDisplayCollectionRef } from '../../../declarations/interfaces/table-data-display-collection-ref.interface';
import { TableEventTargetCellData } from '../../../declarations/interfaces/table-event-target-cell-data.interface';
import { TableFeature } from '../../../declarations/interfaces/table-feature.interface';
import { TableHeaderCellContext } from '../../../declarations/interfaces/table-header-cell-context.interface';
import { isTableCellHtmlElement } from '../../../declarations/type-guards/is-table-cell-html-element.type-guard';
import { TableFeatureConstructor } from '../../../declarations/types/table-feature-constructor.type';
import { TableAdaptiveColumnsService } from '../../../services/table-adaptive-columns.service';
import { TableColumnsIntersectionService } from '../../../services/table-columns-intersection.service';
import { TableScrollbarsService } from '../../../services/table-scrollbars.service';
import { TableTemplatesService } from '../../../services/table-templates.service';

const SCROLL_SPEED_PX: number = 5;

function isTriggeredByResizer(event: Event): boolean {
  const targetPath: EventTarget[] = event.composedPath();
  return targetPath.some((target: EventTarget) => target instanceof HTMLElement && 'resizer' in target.dataset);
}

function getCellHtmlElementFromEvent(event: Event): Nullable<TableCellHtmlElement> {
  const targetPath: EventTarget[] = event.composedPath();

  let element: Nullable<TableCellHtmlElement> = null;

  for (const target of targetPath) {
    if (!isTableCellHtmlElement(target)) {
      continue;
    }
    element = target;
  }

  return element;
}

function convertCellHtmlElementToTargetCellData(
  tableCellHtmlElement: Nullable<TableCellHtmlElement>
): Nullable<TableEventTargetCellData> {
  const cellData: Nullable<TableCellHtmlElementDataset> = tableCellHtmlElement?.dataset;

  return isNil(cellData)
    ? null
    : {
        index: Number(cellData.index),
        columnId: cellData.columnId,
        rowId: cellData.rowId,
        rowType: cellData.rowType,
        element: tableCellHtmlElement,
      };
}

function isTableRowType(input: string): input is TableRowType {
  const enumKeys: TableRowType[] = [TableRowType.Body, TableRowType.Header];
  return new Set<string>(enumKeys).has(input);
}

@Component({
  selector: 'pupa-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TableTemplatesService,
    TableColumnsIntersectionService,
    TableScrollbarsService,
    TableAdaptiveColumnsService,
  ],
})
export class TableComponent<T> implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement, {
    cssProps: { ...Hammer.defaults.cssProps, userSelect: 'text' },
  });

  private readonly subscription: Subscription = new Subscription();

  @ViewChild('table', { static: true })
  public tableRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('defaultHeaderCellTemplate', { static: true })
  public defaultHeaderCellTemplateRef?: Nullable<TemplateRef<TableHeaderCellContext>>;

  @ViewChild('defaultBodyCellTemplate', { static: true })
  public defaultBodyCellTemplateRef?: Nullable<TemplateRef<TableBodyCellContext<T>>>;

  @ViewChild('cdkVirtualScrollViewport', { static: true })
  public cdkVirtualScrollViewportRef: Nullable<CdkVirtualScrollViewport>;

  @ViewChild('scrollableContainer', { static: true })
  public scrollableContainerRef?: ScrollableComponent | undefined;

  @ViewChild('headerScrollableContainer', { static: true })
  public headerScrollableRowsContainerRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('headerScrollableRowContainer', { read: ElementRef })
  public headerScrollableRowContainerElementRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('bodyScrollableContainer', { static: true })
  public bodyScrollableContainerRef?: Nullable<ScrollableComponent>;

  @Input() public hasLeftBorder: boolean = true;

  @Input() public hasRightBorder: boolean = true;

  @Input() public controller: TableController<T>;
  private readonly controller$: BehaviorSubject<Nullable<TableController<T>>> = new BehaviorSubject<TableController<T>>(
    null
  );
  private readonly availableController$: Observable<TableController<T>> = this.controller$.pipe(filterNotNil());

  public readonly isVerticalScrollBarVisible$: Observable<boolean> = this.tableScrollbarsService.isVerticalVisible$;
  public readonly isHorizontalScrollBarVisible$: Observable<boolean> = this.tableScrollbarsService.isHorizontalVisible$;

  private readonly dataDisplayCollection$: Observable<TableDataDisplayCollectionRef<T>> =
    this.availableController$.pipe(map((controller: TableController<T>) => controller.getDataDisplayCollectionRef()));

  public readonly data$: Observable<T[]> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.data$)
  );

  public readonly headerRowHeightRem$: Observable<number> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.headerRowHeightRem$)
  );
  public readonly bodyRowHeightRem$: Observable<number> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.bodyRowHeightRem$)
  );

  public readonly bodyRowHeightPx$: Observable<number> = combineLatest([
    this.clientUiStateHandlerService.remSizePx$,
    this.bodyRowHeightRem$,
  ]).pipe(map(([remSizePx, bodyRowHeightRem]: [number, number]) => remSizePx * bodyRowHeightRem));

  public readonly virtualScrollDataSource$: Observable<TableBodyRowsDataSource<T>> = this.dataDisplayCollection$.pipe(
    map((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.virtualScrollDataSource)
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

  public readonly headerRow$: Observable<TableRow> = this.dataDisplayCollection$.pipe(
    map((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.headerRow)
  );

  public readonly placeholderRow$: Observable<TableRow> = this.dataDisplayCollection$.pipe(
    map((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.placeholderRow)
  );

  public readonly trackBy$: Observable<TrackByFunction<T>> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.trackBy$)
  );

  public readonly trackBodyRowBy$: Observable<TrackByFunction<TableBodyRow<T | null>>> = this.trackBy$.pipe(
    map(
      (trackBy: TrackByFunction<T | null>) =>
        (index: number, row: TableBodyRow<T | null>): ReturnType<typeof trackBy> =>
          trackBy(index, row.data)
    ),
    shareReplayWithRefCount()
  );

  private readonly minBufferRem$: Observable<number> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.minBufferRem$)
  );

  public readonly minBufferPx$: Observable<number> = combineLatest([
    this.clientUiStateHandlerService.remSizePx$,
    this.minBufferRem$,
  ]).pipe(map(([remSizePx, minBufferRem]: [number, number]) => remSizePx * minBufferRem));

  public readonly eventBus$: Observable<EventBus> = this.availableController$.pipe(
    map((controller: TableController<T>) => controller.eventBus)
  );

  public readonly leftHiddenColumnsCount$: Observable<number> =
    this.tableColumnsIntersectionService.leftHiddenColumnIds$.pipe(
      map((leftHiddenColumnIds: string[]) => leftHiddenColumnIds.length)
    );

  public readonly hasLeftHiddenColumns$: Observable<boolean> = this.leftHiddenColumnsCount$.pipe(
    map((leftHiddenColumnsCount: number) => leftHiddenColumnsCount > 0),
    distinctUntilChanged()
  );

  public readonly rightHiddenColumnsCount$: Observable<number> =
    this.tableColumnsIntersectionService.rightHiddenColumnIds$.pipe(
      map((rightHiddenColumnIds: string[]) => rightHiddenColumnIds.length)
    );

  public readonly hasRightHiddenColumns$: Observable<boolean> = this.rightHiddenColumnsCount$.pipe(
    map((rightHiddenColumnsCount: number) => rightHiddenColumnsCount > 0),
    distinctUntilChanged()
  );

  public readonly columnDndIndicatorOffsetLeft$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<
    Nullable<number>
  >(null);

  public readonly dndRowsSettings$: Observable<DndSettings<T> | undefined> = this.availableController$.pipe(
    take(1),
    map((tableController: TableController<T>) => tableController.dndRowsSettings),
    shareReplayWithRefCount()
  );
  public readonly dndIndicatorTopPxCoords$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public readonly currentDndTargetItemId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private readonly internalSystemFeatures: TableFeatureConstructor<T>[] = [
    TableCommonFeature,
    TableResizeFeature,
    TableDndFeature,
    TableScrollFeature,
    TableHoverFeature,
  ];
  private activeInternalFeatures: TableFeature[] = [];
  private activeExternalFeatures: TableFeature[] = [];

  constructor(
    private readonly tableTemplatesService: TableTemplatesService<T>,
    public readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly tableColumnsIntersectionService: TableColumnsIntersectionService,
    private readonly tableScrollbarsService: TableScrollbarsService,
    private readonly renderer: Renderer2,
    private readonly injector: Injector,
    private readonly elementRef: ElementRef
  ) {
    this.initHammerEvents();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processTableControllerChanges(changes.controller);
  }

  public ngOnInit(): void {
    this.setCdkVirtualScrollContentWrapperWidth();
    this.registerDefaultTemplates();

    this.subscription.add(this.processListRangeChanges());
    this.subscription.add(this.processHiddenColumnIdsChanges());
    this.subscription.add(this.processColumnDndIndicatorPositionChanges());
    this.subscription.add(this.processRemSizePx());
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.updateDataTableSizesOnWindowResize());
    this.subscription.add(this.setFeaturesOnApiDataChanges());

    this.startEventsQueue();
    this.registerHeaderScrollableContainerForIntersectionDetection();
    this.measureFirstVisibleListRange();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.disposeFeatures();
    this.hammerManager.destroy();
  }

  public processDndMove(dndMoveData: DndMoveData): void {
    this.dndRowsSettings$.pipe(filterNotNil(), take(1)).subscribe((dndRowsSettings: DndSettings<T>) => {
      dndRowsSettings.dndOnMove(dndMoveData);
      this.checkAndStartScrollLoop(dndMoveData.dndCloneCoords[1]);
      this.highlightDndDroppableZone(dndMoveData);
    });
  }

  public processDndDrop(dndDropData: DndDropData): void {
    this.dndRowsSettings$.pipe(filterNotNil(), take(1)).subscribe((dndRowsSettings: DndSettings<T>) => {
      dndRowsSettings.dndOnDrop(dndDropData);
      this.scrollableContainerRef.stopScrollTopByDeltaLoop();
      this.dndIndicatorTopPxCoords$.next(null);
      this.currentDndTargetItemId$.next(null);
    });
  }

  public processVerticalScrollBarVisibilityChanges(isVisible: boolean): void {
    this.tableScrollbarsService.isVerticalVisible$.next(isVisible);
    this.dispatchEvent(new TableEvents.VerticalScrollBarVisibilityChanged(isVisible));
  }

  public processHorizontalScrollBarVisibilityChanges(isVisible: boolean): void {
    this.tableScrollbarsService.isHorizontalVisible$.next(isVisible);
    this.dispatchEvent(new TableEvents.HorizontalScrollBarVisibilityChanged(isVisible));
  }

  public processTableMouseEvent(event: MouseEvent): void {
    const element: Nullable<TableCellHtmlElement> = getCellHtmlElementFromEvent(event);
    this.dispatchEvent(new TableEvents.MouseOver(convertCellHtmlElementToTargetCellData(element)));
  }

  public processClick(event: Event): void {
    const element: Nullable<TableCellHtmlElement> = getCellHtmlElementFromEvent(event);

    if (isNil(element)) {
      return;
    }

    const cellData: TableCellHtmlElementDataset = element.dataset;

    if (!isTableRowType(cellData.rowType)) {
      return;
    }

    this.dispatchEvent(new TableEvents.CellClick(convertCellHtmlElementToTargetCellData(element)));
  }

  public processPanStart(event: HammerInput): void {
    const element: Nullable<TableCellHtmlElement> = getCellHtmlElementFromEvent(event.srcEvent);
    this.dispatchEvent(
      new TableEvents.PanStart(
        convertCellHtmlElementToTargetCellData(element),
        isTriggeredByResizer(event.srcEvent),
        event.pointerType
      )
    );
  }

  public processPan(event: HammerInput): void {
    const srcEvent: Event = event.srcEvent;

    if (!(srcEvent instanceof PointerEvent)) {
      return;
    }

    const element: Nullable<TableCellHtmlElement> = getCellHtmlElementFromEvent(srcEvent);

    this.dispatchEvent(
      new TableEvents.Pan(
        convertCellHtmlElementToTargetCellData(element),
        [event.deltaX, event.deltaY],
        [srcEvent.clientX, srcEvent.clientY]
      )
    );
  }

  public processPanEnd(event: HammerInput): void {
    const element: Nullable<TableCellHtmlElement> = getCellHtmlElementFromEvent(event.srcEvent);
    this.dispatchEvent(new TableEvents.PanEnd(convertCellHtmlElementToTargetCellData(element)));
  }

  public processBodyScrollLeftChanges(scrollLeft: number): void {
    const scrollableHeaderCells: HTMLElement = this.headerScrollableRowContainerElementRef?.nativeElement;
    this.renderer.setStyle(scrollableHeaderCells, 'transform', `translateX(${-scrollLeft}px)`);
  }

  public getDndItemIdGetter(rowId: string): () => string {
    return () => rowId;
  }

  private initHammerEvents(): void {
    this.hammerManager.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0, velocity: 0 }));
    this.hammerManager.add(new Hammer.Press());

    this.hammerManager.on('panstart', (event: HammerInput) => this.processPanStart(event));
    this.hammerManager.on('pan', (event: HammerInput) => this.processPan(event));
    this.hammerManager.on('panend', (event: HammerInput) => this.processPanEnd(event));
  }

  private startEventsQueue(): void {
    this.dispatchEvent(new QueueEvents.StartQueue());
  }

  private checkAndStartScrollLoop(positionY: number): void {
    this.scrollableContainerRef.stopScrollTopByDeltaLoop();

    if (this.scrollableContainerRef.isIntersectsTopScrollTriggerZone(positionY)) {
      this.scrollableContainerRef.startScrollTopByDeltaLoop(-SCROLL_SPEED_PX);
      return;
    }

    if (this.scrollableContainerRef.isIntersectsBottomScrollTriggerZone(positionY)) {
      this.scrollableContainerRef.startScrollTopByDeltaLoop(SCROLL_SPEED_PX);
      return;
    }
  }

  private highlightDndDroppableZone(dndMoveData: DndMoveData): void {
    if (dndMoveData.dndDropPosition === 'within') {
      this.currentDndTargetItemId$.next(dndMoveData.dndTargetItem.id);
      this.dndIndicatorTopPxCoords$.next(null);
      return;
    }

    this.dndIndicatorTopPxCoords$.next(dndMoveData.dndIndicatorCoords);
  }

  private measureFirstVisibleListRange(): void {
    this.dataDisplayCollection$.pipe(take(1)).subscribe((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => {
      this.cdkVirtualScrollViewportRef.checkViewportSize();
      const viewportSizePx: number = this.cdkVirtualScrollViewportRef.getViewportSize();

      dataDisplayCollection.setTableViewportSizePx(viewportSizePx);
      dataDisplayCollection.measureFirstVisibleListRange();
    });
  }

  private processTableControllerChanges(change: ComponentChange<this, TableController<T>>): void {
    const controller: TableController<T> = change?.currentValue;
    if (isNil(controller)) {
      return;
    }
    this.controller$.next(controller);
  }

  /**
   * @description
   * Angular shit: 🩼🦯🤡 content need max width from table element.
   * Use this method instead of :ng-deep
   */
  private setCdkVirtualScrollContentWrapperWidth(): void {
    const cdkVirtualScrollElement: HTMLElement = this.cdkVirtualScrollViewportRef.elementRef.nativeElement;
    if (!(cdkVirtualScrollElement.firstChild instanceof HTMLElement)) {
      return;
    }
    const cdkVirtualScrollContentWrapperElement: HTMLElement = cdkVirtualScrollElement.firstChild;
    this.renderer.setStyle(cdkVirtualScrollContentWrapperElement, 'width', '100%');
  }

  private registerDefaultTemplates(): void {
    this.tableTemplatesService.registerDefaultTemplates({
      headerCell: this.defaultHeaderCellTemplateRef,
      bodyCell: this.defaultBodyCellTemplateRef,
    });
  }

  private processListRangeChanges(): Subscription {
    return this.virtualScrollDataSource$
      .pipe(
        take(1),
        switchMap((virtualScrollDataSource: TableBodyRowsDataSource<T>) => virtualScrollDataSource.listRange$)
      )
      .subscribe((listRange: ListRange) => this.dispatchEvent(new TableEvents.ListRangeChanged(listRange)));
  }

  private processHiddenColumnIdsChanges(): Subscription {
    return combineLatest([
      this.tableColumnsIntersectionService.leftHiddenColumnIds$,
      this.tableColumnsIntersectionService.rightHiddenColumnIds$,
    ]).subscribe(([leftHiddenColumnIds, rightHiddenColumnIds]: [string[], string[]]) =>
      this.dispatchEvent(new TableEvents.HiddenColumnIdsChanged(leftHiddenColumnIds, rightHiddenColumnIds))
    );
  }

  private updateDataTableSizesOnWindowResize(): Subscription {
    return this.clientUiStateHandlerService.windowSquare$
      .pipe(
        map(() => {
          const { clientWidth, clientHeight }: HTMLElement = this.tableRef.nativeElement;
          return { tableWidthPx: clientWidth, tableHeightPx: clientHeight };
        }),
        withLatestFrom(this.dataDisplayCollection$)
      )
      .subscribe(
        ([{ tableWidthPx, tableHeightPx }, dataDisplayCollection]: [
          { tableWidthPx: number; tableHeightPx: number },
          TableDataDisplayCollectionRef<T>
        ]) => {
          dataDisplayCollection.setTableWidthPx(tableWidthPx);
          dataDisplayCollection.setTableHeightPx(tableHeightPx);
        }
      );
  }

  private registerHeaderScrollableContainerForIntersectionDetection(): void {
    const headerScrollableRowsContainer: HTMLElement = this.headerScrollableRowsContainerRef.nativeElement;
    this.tableColumnsIntersectionService.registerScrollArea(headerScrollableRowsContainer);
  }

  private setFeaturesOnApiDataChanges(): Subscription {
    return combineLatest([this.eventBus$, this.dataDisplayCollection$]).subscribe(
      ([eventBus, dataDisplayCollection]: [EventBus, TableDataDisplayCollectionRef<T>]) => {
        this.disposeFeatures();

        const tableApi: TableApi<T> = {
          eventBus,
          displayData: dataDisplayCollection,
          bodyScrollableContainerRef: this.bodyScrollableContainerRef,
          cdkVirtualScrollViewportRef: this.cdkVirtualScrollViewportRef,
          templatesRegistry: this.tableTemplatesService,
          tableInjector: this.injector,
          tableElement: this.tableRef.nativeElement,
        };

        for (const featureConstructor of this.internalSystemFeatures) {
          this.activeInternalFeatures.push(new featureConstructor(tableApi));
        }

        for (const featureConstructor of this.controller.features) {
          this.activeExternalFeatures.push(new featureConstructor(tableApi));
        }
      }
    );
  }

  private processColumnDndIndicatorPositionChanges(): Subscription {
    return this.eventBus$
      .pipe(
        switchMap((eventBus: EventBus) => eventBus.listen()),
        filterByInstanceOf(TableEvents.ColumnDragIndicatorPositionChange),
        map((event: TableEvents.ColumnDragIndicatorPositionChange) => event.offsetLeft),
        distinctUntilChanged()
      )
      .subscribe((offsetLeft: Nullable<number>) => {
        this.columnDndIndicatorOffsetLeft$.next(offsetLeft);
      });
  }

  private processRemSizePx(): Subscription {
    return combineLatest([this.clientUiStateHandlerService.remSizePx$, this.dataDisplayCollection$]).subscribe(
      ([remSizePx, dataDisplayCollection]: [number, TableDataDisplayCollectionRef<T>]) =>
        dataDisplayCollection.setRemSizePx(remSizePx)
    );
  }

  private disposeFeatures(): void {
    for (const feature of this.activeInternalFeatures) {
      feature.dispose();
    }
    this.activeInternalFeatures = [];

    for (const feature of this.activeExternalFeatures) {
      feature.dispose();
    }
    this.activeExternalFeatures = [];
  }

  private dispatchEvent(event: BusEventBase): void {
    this.eventBus$.pipe(take(1)).subscribe((eventBus: EventBus) => {
      eventBus.dispatch(event);
    });
  }
}

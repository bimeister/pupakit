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
import { filterByInstanceOf, filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { BusEventBase } from '../../../../../internal/declarations/classes/abstract/bus-event-base.abstract';
import { TableBodyRow } from '../../../../../internal/declarations/classes/table-body-row.class';
import { TableBodyRowsDataSource } from '../../../../../internal/declarations/classes/table-body-rows-data-source.class';
import { TableColumn } from '../../../../../internal/declarations/classes/table-column.class';
import { TableController } from '../../../../../internal/declarations/classes/table-controller.class';
import { TableCommonController } from '../../../../../internal/declarations/classes/table-controllers/table-common-controller.class';
import { TableDndController } from '../../../../../internal/declarations/classes/table-controllers/table-dnd-controller.class';
import { TableHoverController } from '../../../../../internal/declarations/classes/table-controllers/table-hover-controller.class';
import { TableResizeController } from '../../../../../internal/declarations/classes/table-controllers/table-resize-controller.class';
import { TableScrollController } from '../../../../../internal/declarations/classes/table-controllers/table-scroll-controller.class';
import { TableSortingController } from '../../../../../internal/declarations/classes/table-controllers/table-sorting-controller.class';
import { TableRow } from '../../../../../internal/declarations/classes/table-row.class';
import { TableRowType } from '../../../../../internal/declarations/enums/table-row-type.enum';
import { QueueEvents } from '../../../../../internal/declarations/events/queue.events';
import { TableEvents } from '../../../../../internal/declarations/events/table.events';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { TableApi } from '../../../../../internal/declarations/interfaces/table-api.interface';
import { TableBodyCellContext } from '../../../../../internal/declarations/interfaces/table-body-cell-context.interface';
import { TableCellHtmlElementDataset } from '../../../../../internal/declarations/interfaces/table-cell-html-element-dataset.interface';
import { TableCellHtmlElement } from '../../../../../internal/declarations/interfaces/table-cell-html-element.interface';
import { TableDataDisplayCollectionRef } from '../../../../../internal/declarations/interfaces/table-data-display-collection-ref.interface';
import { TableEventTargetCellData } from '../../../../../internal/declarations/interfaces/table-event-target-cell-data.interface';
import { TableFeatureController } from '../../../../../internal/declarations/interfaces/table-feature-controller.interface';
import { TableHeaderCellContext } from '../../../../../internal/declarations/interfaces/table-header-cell-context.interface';
import { TableFeatureControllerConstructor } from '../../../../../internal/declarations/types/table-feature-controller-constructor.type';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';
import { isTableCellHtmlElement } from '../../../../../internal/type-guards/is-table-cell-html-element.type-guard';
import { ScrollableComponent } from '../../../scrollable/components/scrollable/scrollable.component';
import { TableColumnsIntersectionService } from '../../services/table-columns-intersection.service';
import { TableScrollbarsService } from '../../services/table-scrollbars.service';
import { TableTemplatesService } from '../../services/table-templates.service';

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
  providers: [TableTemplatesService, TableColumnsIntersectionService, TableScrollbarsService],
})
export class TableComponent<T> implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private readonly hammerManager: HammerManager = new Hammer.Manager(this.elementRef.nativeElement);

  private readonly subscription: Subscription = new Subscription();

  @ViewChild('table', { static: true })
  public tableRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('defaultHeaderCellTemplate', { static: true })
  public defaultHeaderCellTemplateRef?: Nullable<TemplateRef<TableHeaderCellContext>>;

  @ViewChild('defaultBodyCellTemplate', { static: true })
  public defaultBodyCellTemplateRef?: Nullable<TemplateRef<TableBodyCellContext<T>>>;

  @ViewChild('cdkVirtualScrollViewport', { static: true })
  public cdkVirtualScrollViewportRef: Nullable<CdkVirtualScrollViewport>;

  @ViewChild('headerScrollableContainer', { static: true })
  public headerScrollableRowsContainerRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('headerScrollableRowContainer', { read: ElementRef })
  public headerScrollableRowContainerElementRef?: Nullable<ElementRef<HTMLElement>>;

  @ViewChild('bodyScrollableContainer', { static: true })
  public bodyScrollableContainerRef?: Nullable<ScrollableComponent>;

  @ViewChild('decorScrollableRowContainer', { read: ElementRef })
  public decorScrollableRowContainerElementRef?: Nullable<ElementRef<HTMLElement>>;

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

  public readonly headerRowHeightPx$: Observable<number> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.headerRowHeightPx$)
  );
  public readonly bodyRowHeightPx$: Observable<number> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.bodyRowHeightPx$)
  );

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

  public readonly minBufferPx$: Observable<number> = this.dataDisplayCollection$.pipe(
    switchMap((dataDisplayCollection: TableDataDisplayCollectionRef<T>) => dataDisplayCollection.minBufferPx$)
  );

  public readonly eventBus$: Observable<EventBus> = this.availableController$.pipe(
    map((controller: TableController<T>) => controller.eventBus)
  );

  public readonly leftHiddenColumnsCount$: Observable<number> =
    this.tableColumnsIntersectionService.leftHiddenColumnIds$.pipe(
      map((leftHiddenColumnIds: string[]) => leftHiddenColumnIds.length)
    );

  public readonly rightHiddenColumnsCount$: Observable<number> =
    this.tableColumnsIntersectionService.rightHiddenColumnIds$.pipe(
      map((rightHiddenColumnIds: string[]) => rightHiddenColumnIds.length)
    );

  public readonly columnDndIndicatorOffsetLeft$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<
    Nullable<number>
  >(null);

  private readonly featureControllers: TableFeatureControllerConstructor<T>[] = [
    TableCommonController,
    TableResizeController,
    TableSortingController,
    TableDndController,
    TableScrollController,
    TableHoverController,
  ];
  private activeFeatureConstructors: TableFeatureController[] = [];

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

  public readonly rowTrackByFunction: TrackByFunction<TableBodyRow<T>> = (index: number, _item: TableBodyRow<T>) =>
    index;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processTableControllerChanges(changes.controller);
  }

  public ngOnInit(): void {
    this.setCdkVirtualScrollContentWrapperWidth();
    this.registerDefaultTemplates();

    this.subscription.add(this.processListRangeChanges());
    this.subscription.add(this.processHiddenColumnIdsChanges());
    this.subscription.add(this.processColumnDndIndicatorPositionChanges());
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.updateDataTableSizesOnWindowResize());
    this.subscription.add(this.setFeatureControllersOnApiDataChanges());

    this.startEventsQueue();
    this.registerHeaderScrollableContainerForIntersectionDetection();
    this.measureFirstVisibleListRange();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.disposeFeatureControllers();
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
    const scrollableDecorCells: HTMLElement = this.decorScrollableRowContainerElementRef?.nativeElement;
    this.renderer.setStyle(scrollableHeaderCells, 'transform', `translateX(${-scrollLeft}px)`);
    this.renderer.setStyle(scrollableDecorCells, 'transform', `translateX(${-scrollLeft}px)`);
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
    controller.init(this.injector);
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

  private setFeatureControllersOnApiDataChanges(): Subscription {
    return combineLatest([this.eventBus$, this.dataDisplayCollection$]).subscribe(
      ([eventBus, dataDisplayCollection]: [EventBus, TableDataDisplayCollectionRef<T>]) => {
        this.disposeFeatureControllers();

        const tableApi: TableApi<T> = {
          eventBus,
          displayData: dataDisplayCollection,
          bodyScrollableContainerRef: this.bodyScrollableContainerRef,
          cdkVirtualScrollViewportRef: this.cdkVirtualScrollViewportRef,
          templatesRegistry: this.tableTemplatesService,
          tableInjector: this.injector,
          tableElement: this.tableRef.nativeElement,
        };

        for (const featureControllerConstructor of this.featureControllers) {
          this.activeFeatureConstructors.push(new featureControllerConstructor(tableApi));
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

  private disposeFeatureControllers(): void {
    for (const featureController of this.activeFeatureConstructors) {
      featureController.dispose();
    }
    this.activeFeatureConstructors = [];
  }

  private dispatchEvent(event: BusEventBase): void {
    this.eventBus$.pipe(take(1)).subscribe((eventBus: EventBus) => {
      eventBus.dispatch(event);
    });
  }
}

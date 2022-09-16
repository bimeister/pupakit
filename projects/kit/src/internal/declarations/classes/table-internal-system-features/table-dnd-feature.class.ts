import { TemplateRef } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { filterByInstanceOf, filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { ScrollableComponent } from '../../../../lib/components/scrollable/components/scrollable/scrollable.component';
import { DndCloneService } from '../../../shared/services/dnd-clone.service';
import { TableColumnPin } from '../../enums/table-column-pin.enum';
import { TableRowType } from '../../enums/table-row-type.enum';
import { TableColumnEvents } from '../../events/table-column.events';
import { TableEvents } from '../../events/table.events';
import { TableApi } from '../../interfaces/table-api.interface';
import { TableDataDisplayCollectionRef } from '../../interfaces/table-data-display-collection-ref.interface';
import { TableEventTargetCellData } from '../../interfaces/table-event-target-cell-data.interface';
import { TableFeature } from '../../interfaces/table-feature.interface';
import { TableHeaderCellContext } from '../../interfaces/table-header-cell-context.interface';
import { TableTemplatesRegistry } from '../../interfaces/tables-templates-registry.interface';
import { TableColumn } from '../table-column.class';

const SCROLL_SPEED_PX: number = 5;

export class TableDndFeature<T> implements TableFeature {
  private readonly eventBus: EventBus = this.api.eventBus;
  private readonly dndCloneService: DndCloneService = this.api.tableInjector.get(DndCloneService);
  private readonly tableElement: HTMLElement = this.api.tableElement;
  private readonly displayData: TableDataDisplayCollectionRef<T> = this.api.displayData;
  private readonly bodyScrollableContainerRef: ScrollableComponent = this.api.bodyScrollableContainerRef;
  private readonly templateRegistry: TableTemplatesRegistry<T> = this.api.templatesRegistry;

  private readonly subscription: Subscription = new Subscription();

  private readonly columnIdToColumnMap$: Observable<Map<string, TableColumn>> = this.displayData.columnIdToColumnMap$;

  private currentDraggableColumn: TableColumn | null = null;
  private currentDraggableNewIndex: number | null = null;
  private currentTargetColumn: TableColumn | null = null;
  private isScrollLoopActive: boolean = false;

  constructor(private readonly api: TableApi<T>) {
    this.subscription.add(this.processPanStart());
    this.subscription.add(this.processPan());
    this.subscription.add(this.processPanEnd());
  }

  public dispose(): void {
    this.subscription.unsubscribe();
  }

  private processPanStart(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filterByInstanceOf(TableEvents.PanStart),
        filter((event: TableEvents.PanStart) => event.pointerType === 'mouse' && !event.triggeredByResizer),
        map((event: TableEvents.PanStart) => event.targetCell),
        filterNotNil(),
        filter((targetCell: TableEventTargetCellData) => targetCell.rowType === TableRowType.Header),
        withLatestFrom(this.columnIdToColumnMap$),
        map(([targetCell, columnIdToColumnMap]: [TableEventTargetCellData, Map<string, TableColumn>]) => [
          targetCell,
          columnIdToColumnMap.get(targetCell.columnId),
        ]),
        filter(([_, tableColumn]: [TableEventTargetCellData, Nullable<TableColumn>]) => !isNil(tableColumn)),
        filter(
          ([_, tableColumn]: [TableEventTargetCellData, TableColumn]) =>
            !isNil(tableColumn.definition.draggable) && tableColumn.definition.draggable
        ),
        filter(([_, tableColumn]: [TableEventTargetCellData, TableColumn]) => {
          const columnPin: TableColumnPin = tableColumn.definition.pin ?? TableColumnPin.None;
          return columnPin === TableColumnPin.None;
        })
      )
      .pipe(
        map(([targetCell, tableColumn, _]: [TableEventTargetCellData, TableColumn, boolean]) => [
          targetCell,
          tableColumn,
        ])
      )
      .subscribe(([targetCell, tableColumn]: [TableEventTargetCellData, TableColumn]) => {
        this.startColumnDragging(targetCell, tableColumn);
      });
  }

  private processPan(): Subscription {
    return this.eventBus
      .listen()
      .pipe(
        filter(() => !isNil(this.currentDraggableColumn)),
        filterByInstanceOf(TableEvents.Pan)
      )
      .subscribe((event: TableEvents.Pan) => {
        this.stopScrollLoop();
        this.updateCurrentTargetCell(event);
        this.checkAndStartScrollLoop(event);
        this.calculateNewIndexAndUpdateDndIndicatorPosition(event);
        this.moveCurrentDraggableColumnClone([event.globalPosition[0], event.globalPosition[1]]);
      });
  }

  private processPanEnd(): Subscription {
    return this.eventBus
      .listen()
      .pipe(filterByInstanceOf(TableEvents.PanEnd))
      .subscribe(() => {
        this.stopColumnDragging();
        this.hideDndIndicator();
        this.stopScrollLoop();

        if (isNil(this.currentDraggableColumn) || isNil(this.currentDraggableNewIndex)) {
          return;
        }

        this.eventBus.dispatch(
          new TableEvents.ColumnDragEnd(
            this.currentDraggableColumn.definition.id,
            this.currentDraggableNewIndex,
            this.currentDraggableColumn.index
          )
        );

        this.clearTargetColumnData();
        this.currentDraggableColumn = null;
      });
  }

  private startColumnDragging(targetCell: TableEventTargetCellData, tableColumn: TableColumn): void {
    this.currentDraggableColumn = tableColumn;
    const columnId: string = this.currentDraggableColumn.definition.id;
    const columnType: string = this.currentDraggableColumn.definition.type;

    this.eventBus.dispatch(new TableEvents.ColumnDragStart(columnId));

    this.currentDraggableColumn.dispatchEvent(new TableColumnEvents.CurrentDraggableChanged(true));

    const headerCellTemplateRef: TemplateRef<TableHeaderCellContext> =
      this.templateRegistry.getHeaderCellTemplateByType(columnType);

    const templateContext: TableHeaderCellContext = {
      $implicit: this.currentDraggableColumn,
      isDndClone: true,
    };

    const dndCloneWidthPx: number = targetCell.element.clientWidth;
    const dndCloneHeightPx: number = targetCell.element.clientHeight;

    this.dndCloneService.create(
      headerCellTemplateRef,
      templateContext,
      dndCloneWidthPx,
      dndCloneHeightPx,
      this.api.tableInjector
    );
  }

  private updateCurrentTargetCell(event: TableEvents.Pan): void {
    const targetCell: Nullable<TableEventTargetCellData> = event.targetCell;
    const currentTargetColumnId: Nullable<string> = this.currentTargetColumn?.definition.id;

    if (currentTargetColumnId === targetCell?.columnId) {
      return;
    }

    this.columnIdToColumnMap$.pipe(take(1)).subscribe((columnIdToColumnMap: Map<string, TableColumn>) => {
      this.hideDndIndicator();

      this.currentTargetColumn?.dispatchEvent(new TableColumnEvents.CurrentDragTargetChanged(false));
      const newTargetColumn: Nullable<TableColumn> = columnIdToColumnMap.get(targetCell?.columnId);

      if (isNil(newTargetColumn)) {
        this.clearTargetColumnData();
        return;
      }

      const newTargetColumnPin: TableColumnPin = newTargetColumn.definition.pin ?? TableColumnPin.None;

      if (newTargetColumnPin !== TableColumnPin.None) {
        this.clearTargetColumnData();
        return;
      }

      this.currentTargetColumn = newTargetColumn;
      this.currentTargetColumn.dispatchEvent(new TableColumnEvents.CurrentDragTargetChanged(true));
    });
  }

  private checkAndStartScrollLoop(event: TableEvents.Pan): void {
    if (this.bodyScrollableContainerRef.isIntersectsLeftScrollTriggerZone(event.globalPosition[0])) {
      this.startScrollLoop(-SCROLL_SPEED_PX);
    }

    if (this.bodyScrollableContainerRef.isIntersectsRightScrollTriggerZone(event.globalPosition[0])) {
      this.startScrollLoop(SCROLL_SPEED_PX);
    }
  }

  private calculateNewIndexAndUpdateDndIndicatorPosition(event: TableEvents.Pan): void {
    const targetCell: Nullable<TableEventTargetCellData> = event.targetCell;
    const currentDraggableColumnId: Nullable<string> = this.currentDraggableColumn?.definition.id;
    const currentTargetColumnId: Nullable<string> = this.currentTargetColumn?.definition.id;

    if (
      isNil(targetCell) ||
      isNil(this.currentTargetColumn) ||
      isNil(this.currentDraggableColumn) ||
      currentDraggableColumnId === currentTargetColumnId
    ) {
      return;
    }
    const draggableIndex: number = this.currentDraggableColumn.index;
    const targetIndex: number = this.currentTargetColumn.index;

    const targetClientRect: DOMRect = targetCell.element.getBoundingClientRect();
    const tableClientRect: DOMRect = this.tableElement.getBoundingClientRect();
    const scrollableBodyRect: DOMRect = this.bodyScrollableContainerRef.element.getBoundingClientRect();

    const targetWidthPx: number = targetClientRect.width;
    const targetXMousePosition: number = event.globalPosition[0] - targetClientRect.left;
    const positionCoefficient: number = Math.round(
      (targetWidthPx - (targetWidthPx - targetXMousePosition)) / targetWidthPx
    );
    const indexCorrectionCoefficient: number =
      draggableIndex - targetIndex > 0 ? positionCoefficient : positionCoefficient - 1;
    const draggableNewIndex: number = targetIndex + indexCorrectionCoefficient;

    const indicatorPosition: number = positionCoefficient < 0.5 ? targetClientRect.left - 1 : targetClientRect.right;

    const isIndicatorVisible: boolean =
      !this.isScrollLoopActive &&
      indicatorPosition >= scrollableBodyRect.left - 1 &&
      indicatorPosition <= scrollableBodyRect.right + 1;

    const indicatorOffsetLeft: number = indicatorPosition - tableClientRect.left;

    if (!isIndicatorVisible || draggableNewIndex === draggableIndex) {
      this.hideDndIndicator();
    } else {
      this.setDndIndicatorOffsetLeft(indicatorOffsetLeft);
    }

    this.currentDraggableNewIndex = draggableNewIndex;
  }

  private setDndIndicatorOffsetLeft(offsetLeftPx: number): void {
    this.eventBus.dispatch(new TableEvents.ColumnDragIndicatorPositionChange(offsetLeftPx));
  }

  private hideDndIndicator(): void {
    this.eventBus.dispatch(new TableEvents.ColumnDragIndicatorPositionChange(null));
  }

  private moveCurrentDraggableColumnClone(position: [number, number]): void {
    this.dndCloneService.updatePosition(position);
  }

  private stopColumnDragging(): void {
    this.currentDraggableColumn?.dispatchEvent(new TableColumnEvents.CurrentDraggableChanged(false));
    this.dndCloneService.destroy();
  }

  private startScrollLoop(speedPx: number): void {
    this.hideDndIndicator();
    this.bodyScrollableContainerRef.startScrollLeftByDeltaLoop(speedPx);
    this.isScrollLoopActive = true;
  }

  private stopScrollLoop(): void {
    this.bodyScrollableContainerRef.stopScrollLeftByDeltaLoop();
    this.isScrollLoopActive = false;
  }

  private clearTargetColumnData(): void {
    this.currentTargetColumn = null;
    this.currentDraggableNewIndex = null;
  }
}

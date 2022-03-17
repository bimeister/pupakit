import { Injector } from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { Nullable } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableColumnRef } from '../interfaces/table-column-ref.interface';
import { TableColumnSizeController } from './table-column-controllers/table-column-size-controller.class';
import { TableColumnSortingController } from './table-column-controllers/table-column-sorting-controller.class';

export class TableColumn implements TableColumnRef {
  private readonly injector: Injector = Injector.create({
    parent: this.parentInjector,
    providers: [
      {
        provide: EventBus,
        useValue: this.eventBus,
      },
    ],
  });

  private readonly sortingController: TableColumnSortingController = new TableColumnSortingController();
  private readonly sizeController: TableColumnSizeController = new TableColumnSizeController(this.injector);

  private definitionSetterState: Nullable<TableColumnDefinition> = null;

  public index: number = 0;

  public set definition(value: TableColumnDefinition) {
    this.definitionSetterState = value;
    this.sizeController.setDefinitionSizes(value.defaultSizes, value.adaptiveSizes);
    this.sortingController.setDefinition(value);
  }

  public get definition(): Nullable<TableColumnDefinition> {
    return this.definitionSetterState;
  }

  public readonly sorting$: Observable<TableColumnSorting> = this.sortingController.sorting$;
  public readonly widthPx$: Observable<number> = this.sizeController.widthPx$;
  public readonly isCurrentResizable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isCurrentDraggable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isCurrentDragTarget$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly parentInjector: Injector, private readonly eventBus: EventBus) {}

  public toggleSorting(): void {
    this.sortingController.toggleSorting(this.definition.isSortingNoneAvailable);
  }

  public setSorting(sorting: TableColumnSorting): void {
    this.sortingController.setSorting(sorting);
  }

  public updateWidthByDeltaPx(deltaPx: number): Observable<boolean> {
    return this.sizeController.updateWidthByDeltaPx(deltaPx);
  }

  public setWidth(widthPx: number): Observable<boolean> {
    return this.sizeController.setWidth(widthPx);
  }
}

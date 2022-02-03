import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { AgGridEvent, ColDef, ColumnApi, GridApi, GridReadyEvent, IDatasource } from 'ag-grid-community';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, Subscriber } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { GridState } from '../interfaces/grid-state.interface';
import { DatagridManipulatorConfiguration } from './datagrid-manipulator-configuration.class';

export class DatagridManipulator<RowDataT> {
  public get config(): DatagridManipulatorConfiguration<RowDataT> {
    return this.configuration;
  }

  public columnApi$: BehaviorSubject<Nullable<ColumnApi>> = new BehaviorSubject<Nullable<ColumnApi>>(null);
  public gridApi$: BehaviorSubject<Nullable<GridApi>> = new BehaviorSubject<Nullable<GridApi>>(null);

  public readonly onGridReady$: ReplaySubject<GridReadyEvent> = new ReplaySubject<GridReadyEvent>(1);

  constructor(private readonly configuration: DatagridManipulatorConfiguration<RowDataT>) {}

  public gridReady(gridReadyEvent: GridReadyEvent): void {
    this.onGridReady$.next(gridReadyEvent);
    this.onGridReady$.complete();
    this.gridApi$.next(gridReadyEvent.api);
    this.columnApi$.next(gridReadyEvent.columnApi);
  }

  public selectRow(index: number): void {
    this.gridApi$.pipe(take(1), filterNotNil()).subscribe((gridApi: GridApi) => {
      gridApi.ensureIndexVisible(index, 'top');
      gridApi.selectIndex(index, false, true);
    });
  }

  public setColDefs(colDefs: ColDef[]): void {
    this.gridApi$.pipe(take(1)).subscribe((gridApi: GridApi) => {
      if (isNil(gridApi)) {
        this.config.initialColumnDefs = colDefs;
        return;
      }
      gridApi.setColumnDefs(colDefs);
    });
  }

  public setRowData(rowData: RowDataT[]): void {
    this.gridApi$.pipe(take(1)).subscribe((gridApi: GridApi) => {
      if (isNil(gridApi)) {
        this.config.gridOptions.rowModelType = 'clientSide';
        this.config.initialRowData = rowData;
        return;
      }
      gridApi.setRowData(rowData);
    });
  }

  public setRowDataSource(rowDataSource: IDatasource): void {
    this.gridApi$.pipe(take(1)).subscribe((gridApi: GridApi) => {
      if (isNil(gridApi)) {
        this.config.gridOptions.rowModelType = 'infinite';
        this.config.gridOptions.datasource = rowDataSource;
        return;
      }
      gridApi.setDatasource(rowDataSource);
    });
  }

  public normalizeGrid(): void {
    this.makeColumnsFitGridWidth();
    this.normalizeRowHeights();
  }

  public resetRowHeights(): void {
    this.gridApi$.pipe(take(1), filterNotNil()).subscribe((gridApi: GridApi) => {
      gridApi.resetRowHeights();
    });
  }

  public getGridState(): Observable<GridState> {
    return combineLatest([this.gridApi$.pipe(filterNotNil()), this.columnApi$.pipe(filterNotNil())]).pipe(
      take(1),
      map(([gridApi, columnApi]: [GridApi, ColumnApi]) => ({
        columnState: columnApi.getColumnState(),
        sortModel: gridApi.getSortModel(),
      }))
    );
  }

  public setGridState(gridState: GridState): void {
    combineLatest([this.gridApi$.pipe(filterNotNil()), this.columnApi$.pipe(filterNotNil())])
      .pipe(take(1))
      .subscribe(([gridApi, columnApi]: [GridApi, ColumnApi]) => {
        columnApi.setColumnState(gridState.columnState);
        gridApi.setSortModel(gridState.sortModel);
      });
  }

  public getEventObservable<EventDataT extends AgGridEvent>(eventType: string): Observable<EventDataT> {
    return new Observable<EventDataT>((subscriber: Subscriber<EventDataT>) => {
      const listener: Function = (event: EventDataT) => subscriber.next(event);
      this.addEventListener(eventType, listener);

      return {
        unsubscribe: () => this.removeEventListener(eventType, listener),
      };
    });
  }

  public setColumnsVisibility(colIds: string[], visible: boolean): void {
    this.columnApi$
      .pipe(filterNotNil())
      .pipe(take(1))
      .subscribe((columnApi: ColumnApi) => columnApi.setColumnsVisible(colIds, visible));
  }

  private addEventListener(eventType: string, listener: Function): void {
    this.gridApi$.pipe(filterNotNil()).subscribe((gridApi: GridApi) => {
      gridApi.addEventListener(eventType, listener);
    });
  }

  private removeEventListener(eventType: string, listener: Function): void {
    this.gridApi$.pipe(filterNotNil()).subscribe((gridApi: GridApi) => {
      gridApi.removeEventListener(eventType, listener);
    });
  }

  private makeColumnsFitGridWidth(): void {
    this.gridApi$.pipe(take(1), filterNotNil()).subscribe((gridApi: GridApi) => {
      this.config.sizeColumnsToFit ? gridApi.sizeColumnsToFit() : gridApi.doLayout();
    });
  }

  private normalizeRowHeights(): void {
    this.gridApi$
      .pipe(
        take(1),
        filterNotNil(),
        filter(() => this.config.rowsAutoheight)
      )
      .subscribe((gridApi: GridApi) => {
        gridApi.resetRowHeights();
      });
  }
}

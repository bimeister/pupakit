import { TemplateRef } from '@angular/core';
import { ColDef, ColumnApi, GridApi, IDatasource } from 'ag-grid-community';
import { BehaviorSubject, Subscription } from 'rxjs';

import { DatagridColumnSettingsComponent } from '../../../lib/components/datagrid/components/datagrid-column-settings/datagrid-column-settings.component';
import { DatagridTemplateRendererComponent } from '../../../lib/components/datagrid/components/datagrid-template-renderer/datagrid-template-renderer.component';
import { isNullOrUndefined } from '../../helpers/is-null-or-undefined.helper';
import { DatagridColDef } from '../interfaces/datagrid-col-def.interface';
import { DatagridColumnSetting } from '../interfaces/datagrid-column-setting.interface';
import { DatagridManipulatorConfiguration } from './datagrid-manipulator-configuration.class';

export class DatagridManipulator<rowDataT> {

  private get columnApi(): ColumnApi {
    return this.config.gridOptions?.columnApi;
  }

  private get isGridReady(): boolean {
    return !isNullOrUndefined(this.gridApi);
  }

  public get config(): DatagridManipulatorConfiguration<rowDataT> {
    return this.configuration;
  }
  private readonly subscription: Subscription = new Subscription();
  private gridApi: GridApi;

  public columnSettings$: BehaviorSubject<DatagridColumnSetting[]> = new BehaviorSubject<DatagridColumnSetting[]>([]);

  private static readonly actionsColId: string = '_actions';

  private static readonly actionsColumn: DatagridColDef = {
    headerName: '',
    sortable: false,
    colId: DatagridManipulator.actionsColId,
    width: 48,
    pinned: 'right',
    suppressMovable: true,
    isAvailableInSettings: false
  };

  constructor(
    private readonly configuration: DatagridManipulatorConfiguration<rowDataT>,
    private readonly gridReadyCallback?: () => void
  ) {}

  public gridReady(gridApi: GridApi): void {
    this.gridApi = gridApi;
    if (!isNullOrUndefined(this.gridReadyCallback)) {
      this.gridReadyCallback();
    }
  }

  public destroy(): void {
    this.subscription.unsubscribe();
  }

  public selectRow(index: number): void {
    if (!this.isGridReady) {
      return;
    }
    this.gridApi.ensureIndexVisible(index, 'top');
    this.gridApi.selectIndex(index, false, true);
  }

  public setColDefs(colDefs: DatagridColDef[], userActionsCellRef: TemplateRef<HTMLElement> = null): void {
    this.setColumnSettings(colDefs);
    if (this.config.showColumnSettings || !isNullOrUndefined(userActionsCellRef)) {
      colDefs.push(this.getActionsColumn(userActionsCellRef));
    }
    if (!this.isGridReady) {
      this.config.initialColumnDefs = colDefs;
      return;
    }
    this.gridApi.setColumnDefs(colDefs);
  }

  public setRowData(rowData: rowDataT[]): void {
    if (!this.isGridReady) {
      this.config.gridOptions.rowModelType = 'clientSide';
      this.config.initialRowData = rowData;
      return;
    }
    this.gridApi.setRowData(rowData);
  }

  public setRowDataSource(rowDataSource: IDatasource): void {
    if (!this.isGridReady) {
      this.config.gridOptions.rowModelType = 'infinite';
      this.config.gridOptions.datasource = rowDataSource;
      return;
    }
    this.gridApi.setDatasource(rowDataSource);
  }

  public updateColumnSettingsAndSetColumnsVisibility(settings: DatagridColumnSetting[]): void {
    if (!this.isGridReady) {
      return;
    }
    this.columnSettings$.next(settings);

    const visibleColIds: string[] = DatagridManipulator.getVisibleColumnsIds(settings);

    const invisibleColIds: string[] = this.config.gridOptions.columnDefs
      .filter((columnDef: ColDef) => !visibleColIds.includes(columnDef.colId))
      .map((columnDef: ColDef) => columnDef.colId);

    this.columnApi.setColumnsVisible(visibleColIds, true);
    this.columnApi.setColumnsVisible(invisibleColIds, false);
  }

  public normalizeGrid(): void {
    this.makeColumnsFitGridWidth();
    this.normalizeRowHeights();
  }

  private makeColumnsFitGridWidth(): void {
    if (!this.isGridReady) {
      return;
    }
    this.config.sizeColumnsToFit ? this.gridApi.sizeColumnsToFit() : this.gridApi.doLayout();
  }

  private normalizeRowHeights(): void {
    if (!this.isGridReady || !this.config.rowsAutoheight) {
      return;
    }
    this.gridApi.resetRowHeights();
  }

  private setColumnSettings(colDefs: DatagridColDef[]): void {
    if (!this.config.showColumnSettings) {
      return;
    }
    this.columnSettings$.next(
      colDefs.map((colDef: DatagridColDef) => ({
        colId: colDef.colId,
        headerName: colDef.headerName,
        isVisible: !colDef.hide,
        isAvailable: colDef.isAvailableInSettings
      }))
    );
  }

  private getActionsColumn(userActionsCellRef: TemplateRef<HTMLElement> = null): DatagridColDef {
    const actionsColumn: DatagridColDef = DatagridManipulator.actionsColumn;

    if (this.config.showColumnSettings) {
      actionsColumn.headerComponentFramework = DatagridColumnSettingsComponent;
      actionsColumn.headerComponentParams = {
        manipulator: this
      };
    }

    if (!isNullOrUndefined(userActionsCellRef)) {
      actionsColumn.cellRendererFramework = DatagridTemplateRendererComponent;
      actionsColumn.cellRendererParams = {
        templateRef: userActionsCellRef
      };
    }

    return actionsColumn;
  }

  private static getVisibleColumnsIds(settings: DatagridColumnSetting[]): string[] {
    const visibleColIds: string[] = settings.reduce(
      (colIds: string[], currentSetting: DatagridColumnSetting) => {
        if (currentSetting.isVisible) {
          colIds.push(currentSetting.colId);
        }
        return colIds;
      },
      [DatagridManipulator.actionsColId]
    );
    return visibleColIds;
  }
}

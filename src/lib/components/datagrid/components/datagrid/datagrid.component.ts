import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import {
  ColDef,
  GetRowNodeIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams
} from 'ag-grid-community';

import { DatagridManipulator } from '../../../../../internal/declarations/classes/datagrid-manipulator.class';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

export { ColDef, GridApi, GridOptions, GridReadyEvent, IDatasource, IGetRowsParams, GetRowNodeIdFunc };

@Component({
  selector: 'pupa-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent<rowDataT> {
  @Output() public rowClicked: EventEmitter<unknown> = new EventEmitter<unknown>();

  @Input() public manipulator: DatagridManipulator<rowDataT>;

  public get themeClass(): string {
    return `pupagrid-theme-${this.manipulator.config.theme}`;
  }

  @HostListener('window:resize')
  public processWindowResizeEvent(): void {
    this.manipulator.normalizeGrid();
  }

  public handleEvent(emitter: string, data: unknown): void {
    const eventEmitter: EventEmitter<unknown> = this[emitter];
    if (isNullOrUndefined(eventEmitter)) {
      return;
    }
    eventEmitter.emit(data);
  }

  public onGridReady(gridReadyEvent: GridReadyEvent): void {
    this.manipulator.gridReady(gridReadyEvent.api);
  }
}

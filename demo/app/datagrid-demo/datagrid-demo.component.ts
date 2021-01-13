import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { guidGenerate } from '@bimeister/utilities/common';
import { shareReplayWithRefCount } from '@bimeister/utilities/rxjs';
import { Column, ColumnApi, FirstDataRenderedEvent } from 'ag-grid-community';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { DatagridManipulatorConfiguration } from '../../../src/internal/declarations/classes/datagrid-manipulator-configuration.class';
import { DatagridManipulator } from '../../../src/internal/declarations/classes/datagrid-manipulator.class';
import { DatagridDomLayouts } from '../../../src/internal/declarations/enums/datagrid-dom-layouts.enum';
import { DatagridThemes } from '../../../src/internal/declarations/enums/datagrid-themes.enum';
import { ColDef, DatagridTemplateRendererComponent } from '../../../src/public-api';

interface ColumnSetting {
  colId: string;
  name: string;
  isAvailable: boolean;
  isVisible: boolean;
}

@Component({
  selector: 'demo-datagrid-demo',
  templateUrl: './datagrid-demo.component.html',
  styleUrls: ['./datagrid-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridDemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('customCell', { static: false }) public customCellRef: TemplateRef<HTMLElement>;
  @ViewChild('userActionsCell', { static: false }) public readonly userActionsCellTemplate: TemplateRef<HTMLElement>;
  @ViewChild('columnSettingsCell', { static: false }) public readonly columnSettingsCellRef: TemplateRef<HTMLElement>;

  public readonly isColumnSettingsVisible$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public readonly columnSettingsFormControl: FormControl = new FormControl([]);

  public readonly rowData: any[] = [
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter Boxter Boxter Boxter Boxter Boxter ', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 },
    { id: guidGenerate(), make: 'Toyota', model: 'Celica', price: 35000 },
    { id: guidGenerate(), make: 'Ford', model: 'Mondeo', price: 32000 },
    { id: guidGenerate(), make: 'Porsche', model: 'Boxter', price: 72000 }
  ].map((item: any, index: number) => {
    item.id = index.toString();
    return item;
  });

  private colDefs: ColDef[];

  public config: DatagridManipulatorConfiguration<any> = new DatagridManipulatorConfiguration<any>({
    theme: DatagridThemes.Default,
    domLayout: DatagridDomLayouts.Normal,
    rowsAutoheight: true
  });
  public manipulator: DatagridManipulator<any> = new DatagridManipulator<any>(this.config);

  public readonly columns$: Observable<ColumnSetting[]> = this.manipulator
    .getEventObservable<FirstDataRenderedEvent>('firstDataRendered')
    .pipe(
      take(1),
      map((event: FirstDataRenderedEvent) => {
        const columns: Column[] = event.columnApi.getAllColumns();
        return columns.reduce((columnSettings: ColumnSetting[], column: Column) => {
          if (column.getColId() === 'action') {
            return columnSettings;
          }
          columnSettings.push({
            colId: column.getColId(),
            name: column.getColDef().headerName,
            isVisible: !column.getColDef().hide,
            isAvailable: true
          });
          return columnSettings;
        }, []);
      }),
      shareReplayWithRefCount()
    );

  private readonly subscription: Subscription = new Subscription();

  public ngAfterViewInit(): void {
    this.colDefs = [
      { headerName: 'Make', colId: 'make', field: 'make' },
      {
        headerName: 'Model',
        colId: 'model',
        field: 'model',
        cellRendererFramework: DatagridTemplateRendererComponent,
        cellRendererParams: {
          templateRef: this.customCellRef
        },
        autoHeight: true
      },
      { headerName: 'Price', colId: 'price', field: 'price' },
      {
        headerName: '',
        colId: 'action',
        field: 'action',
        pinned: 'right',
        width: 50,
        headerComponentFramework: DatagridTemplateRendererComponent,
        headerComponentParams: {
          templateRef: this.columnSettingsCellRef
        },
        cellRendererFramework: DatagridTemplateRendererComponent,
        cellRendererParams: {
          templateRef: this.userActionsCellTemplate
        },
        autoHeight: true
      }
    ];

    this.manipulator.setColDefs(this.colDefs);
    this.manipulator.setRowData(this.rowData);

    this.columns$.subscribe((columns: ColumnSetting[]) => {
      const visibleColumnIds: string[] = columns.reduce((result: string[], column: ColumnSetting) => {
        if (column.isVisible) {
          result.push(column.colId);
        }
        return result;
      }, []);

      this.columnSettingsFormControl.setValue(visibleColumnIds);
    });

    this.subscription.add(this.processVisibleColumnsChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public scrollToIndex(index: number): void {
    this.manipulator.selectRow(index);
  }

  public toggleColumnSettings(): void {
    this.isColumnSettingsVisible$.pipe(take(1)).subscribe((isColumnSettingsVisible: boolean) => {
      this.isColumnSettingsVisible$.next(!isColumnSettingsVisible);
    });
  }

  private processVisibleColumnsChanges(): Subscription {
    return this.columnSettingsFormControl.valueChanges
      .pipe(withLatestFrom(this.columns$, this.manipulator.columnApi$))
      .subscribe(([visibleColIds, columns, columnApi]: [string[], ColumnSetting[], ColumnApi]) => {
        const colIds: string[] = columns.map((column: ColumnSetting) => column.colId);
        const invisibleColIds: string[] = colIds.filter((colId: string) => !visibleColIds.includes(colId));

        columnApi.setColumnsVisible(visibleColIds, true);
        columnApi.setColumnsVisible(invisibleColIds, false);
      });
  }
}

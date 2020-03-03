import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { DatagridManipulator } from '../../../../../internal/declarations/classes/datagrid-manipulator.class';
import { DatagridColumnSetting } from '../../../../../internal/declarations/interfaces/datagrid-column-setting.interface';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-datagrid-column-settings',
  templateUrl: './datagrid-column-settings.component.html',
  styleUrls: ['./datagrid-column-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridColumnSettingsComponent<rowDataT> implements ICellRendererAngularComp {
  public settings$: Observable<DatagridColumnSetting[]>;

  private manipulator: DatagridManipulator<rowDataT>;

  public refresh(params: ICellRendererParams): boolean {
    this.manipulator = params['manipulator'];
    this.settings$ = this.manipulator.columnSettings$;
    return true;
  }

  public agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  public updateSettingsState(setting: DatagridColumnSetting, isVisible: boolean): void {
    if (isNullOrUndefined(setting) || isNullOrUndefined(isVisible)) {
      return;
    }
    const isValueChanged: boolean = setting.isVisible !== isVisible;
    if (!isValueChanged) {
      return;
    }

    this.updateColumnSetting(setting.colId, isVisible);
  }

  public readonly trackByColId: TrackByFunction<DatagridColumnSetting> = (
    _: number,
    item: DatagridColumnSetting
  ): string => {
    return item.colId;
  };

  private updateColumnSetting(colId: string, isVisible: boolean): void {
    this.settings$.pipe(take(1)).subscribe((settings: DatagridColumnSetting[]) => {
      const updatedSettings: DatagridColumnSetting[] = settings.map((currentSetting: DatagridColumnSetting) => {
        if (currentSetting.colId === colId) {
          return {
            ...currentSetting,
            isVisible
          };
        }
        return currentSetting;
      });
      this.manipulator.updateColumnSettingsAndSetColumnsVisibility(updatedSettings);
    });
  }
}

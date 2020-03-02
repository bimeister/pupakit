import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from '@angular/core';

import { DatagridColumnSetting } from '../../../../../internal/declarations/interfaces/datagrid-column-setting.interface';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-datagrid-column-settings',
  templateUrl: './datagrid-column-settings.component.html',
  styleUrls: ['./datagrid-column-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridColumnSettingsComponent {
  @Input() public settings: DatagridColumnSetting[] = [];

  @Output() public readonly settingsChange: EventEmitter<DatagridColumnSetting[]> = new EventEmitter<
    DatagridColumnSetting[]
  >();

  public updateSettingsState(setting: DatagridColumnSetting, isVisible: boolean): void {
    if (isNullOrUndefined(setting) || isNullOrUndefined(isVisible)) {
      return;
    }
    const isValueChanged: boolean = setting.isVisible !== isVisible;
    if (!isValueChanged) {
      return;
    }
    setting.isVisible = isVisible;
    this.settingsChange.emit(this.settings);
  }

  public readonly trackByColId: TrackByFunction<DatagridColumnSetting> = (
    _: number,
    item: DatagridColumnSetting
  ): string => {
    return item.colId;
  };
}

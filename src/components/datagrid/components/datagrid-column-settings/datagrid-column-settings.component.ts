import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TrackByFunction
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DatagridColumnSetting } from '../../../../internal/declarations/interfaces/datagrid-column-setting.interface';
import {
  DroppableHorizontalPosition
} from '../../../../internal/declarations/types/droppable-horizontal-position.type';
import { isNullOrUndefined } from '../../../../internal/helpers/is-null-or-undefined.helper';

@Component({
  selector: 'pupa-datagrid-column-settings',
  templateUrl: './datagrid-column-settings.component.html',
  styleUrls: ['./datagrid-column-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridColumnSettingsComponent {
  @Input() public settings: DatagridColumnSetting[] = [];
  @Input() public dropdownPosition: DroppableHorizontalPosition = 'right';

  @Output() public readonly settingsChange: EventEmitter<DatagridColumnSetting[]> = new EventEmitter<
    DatagridColumnSetting[]
  >();

  public readonly isDropdownVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @HostListener('window:click')
  public processMouseClick(): void {
    this.isDropdownVisible$.next(false);
  }

  public showDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownVisible$.next(true);
  }

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

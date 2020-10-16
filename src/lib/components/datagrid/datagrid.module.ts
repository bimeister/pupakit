import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { CheckboxModule } from '../checkbox/checkbox.module';
import { ChipSelectModule } from '../chip-select/chip-select.module';
import { DroppableModule } from '../droppable/droppable.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { DatagridColumnSettingsComponent } from './components/datagrid-column-settings/datagrid-column-settings.component';
import { DatagridTemplateRendererComponent } from './components/datagrid-template-renderer/datagrid-template-renderer.component';
import { DatagridComponent } from './components/datagrid/datagrid.component';
import { IconModule } from '../icon/icon.module';
import { mdSettingsIcon } from '../../../internal/constants/icons/md-settings-icon.const';

@NgModule({
  declarations: [DatagridComponent, DatagridColumnSettingsComponent, DatagridTemplateRendererComponent],
  imports: [
    SharedModule,
    CheckboxModule,
    ChipSelectModule,
    IconButtonModule,
    DroppableModule,
    IconModule.forFeature([mdSettingsIcon]),
    AgGridModule.withComponents([DatagridTemplateRendererComponent, DatagridColumnSettingsComponent])
  ],
  exports: [DatagridComponent, DatagridColumnSettingsComponent, DatagridTemplateRendererComponent]
})
export class DatagridModule {}

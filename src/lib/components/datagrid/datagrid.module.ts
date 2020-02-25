import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { CheckboxModule } from '../checkbox/checkbox.module';
import { ChipSelectModule } from '../chip-select/chip-select.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import {
  DatagridColumnSettingsComponent
} from './components/datagrid-column-settings/datagrid-column-settings.component';
import {
  DatagridTemplateRendererComponent
} from './components/datagrid-template-renderer/datagrid-template-renderer.component';
import { DatagridComponent } from './components/datagrid/datagrid.component';

@NgModule({
  declarations: [DatagridComponent, DatagridColumnSettingsComponent, DatagridTemplateRendererComponent],
  imports: [
    SharedModule,
    CheckboxModule,
    ChipSelectModule,
    IconButtonModule,
    AgGridModule.withComponents([DatagridTemplateRendererComponent])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DatagridComponent, DatagridColumnSettingsComponent, DatagridTemplateRendererComponent]
})
export class DatagridModule {}

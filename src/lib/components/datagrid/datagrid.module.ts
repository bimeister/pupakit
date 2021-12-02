import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { mdSettingsIcon } from '../../../internal/constants/icons/md-settings-icon.const';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { DroppableModule } from '../droppable/droppable.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { IconModule } from '../icon/icon.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { DatagridTemplateRendererComponent } from './components/datagrid-template-renderer/datagrid-template-renderer.component';
import { DatagridComponent } from './components/datagrid/datagrid.component';

@NgModule({
  declarations: [DatagridComponent, DatagridTemplateRendererComponent],
  imports: [
    SharedModule,
    CheckboxModule,
    IconButtonModule,
    DroppableModule,
    IconModule.forFeature([mdSettingsIcon]),
    AgGridModule.withComponents([DatagridTemplateRendererComponent]),
  ],
  exports: [DatagridComponent, DatagridTemplateRendererComponent],
})
export class DatagridModule {}

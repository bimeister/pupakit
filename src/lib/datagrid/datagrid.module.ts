import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { CheckboxModule } from '../checkbox';
import { ChipSelectModule } from '../chip-select';
import { IconButtonModule } from '../icon-button';
import { AngularComponent, SharedModule } from './../../internal';
import { DatagridColumnSettingsComponent, DatagridComponent, DatagridTemplateRendererComponent } from './components';

const COMPONENTS: AngularComponent[] = [
  DatagridComponent,
  DatagridColumnSettingsComponent,
  DatagridTemplateRendererComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    CheckboxModule,
    ChipSelectModule,
    IconButtonModule,
    AgGridModule.withComponents([DatagridTemplateRendererComponent])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class DatagridModule {}

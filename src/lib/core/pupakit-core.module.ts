import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ChipButtonComponent } from './components/chip-button/chip-button.component';
import { ChipSelectComponent } from './components/chip-select/chip-select.component';
import { ChipComponent } from './components/chip/chip.component';
import { ControlTextComponent } from './components/control-text/control-text.component';
import { DatagridColumnSettingsComponent } from './components/datagrid-column-settings/datagrid-column-settings.component';
import { DatagridTemplateRendererComponent } from './components/datagrid-template-renderer/datagrid-template-renderer.component';
import { DatagridComponent } from './components/datagrid/datagrid.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DroppableComponent } from './components/droppable/droppable.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { InputComponent } from './components/input/input.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ModalComponent } from './components/modal/modal.component';
import { RatingComponent } from './components/rating/rating.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TileComponent } from './components/tile/tile.component';
import { TreeNodeComponent } from './components/tree/tree-node/tree-node.component';
import { TreeComponent } from './components/tree/tree.component';
import { WasherPanelComponent } from './components/washer-panel/washer-panel.component';

const CORE_COMPONENTS: any[] = [
  ButtonComponent,
  InputComponent,
  CheckboxComponent,
  SpinnerComponent,
  TileComponent,
  ControlTextComponent,
  LoaderComponent,
  DropdownComponent,
  SelectComponent,
  IconButtonComponent,
  SearchFieldComponent,
  SwitcherComponent,
  DroppableComponent,
  RatingComponent,
  DaySelectorComponent,
  WasherPanelComponent,
  IconButtonComponent,
  ChipComponent,
  ChipButtonComponent,
  ChipSelectComponent,
  TreeComponent,
  TreeNodeComponent,
  ModalComponent,
  DatepickerComponent,
  TabsComponent,
  DatagridComponent,
  DatagridTemplateRendererComponent,
  DrawerComponent,
  DatagridColumnSettingsComponent
];

@NgModule({
  imports: [SharedModule, AgGridModule.withComponents([DatagridTemplateRendererComponent])],
  declarations: [...CORE_COMPONENTS],
  exports: [SharedModule, ...CORE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PupakitCore {}

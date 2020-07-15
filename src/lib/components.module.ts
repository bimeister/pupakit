import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../internal/shared/shared.module';
import { ButtonModule } from './components/button/button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { ChipButtonModule } from './components/chip-button/chip-button.module';
import { ChipSelectModule } from './components/chip-select/chip-select.module';
import { ChipTabsModule } from './components/chip-tabs/chip-tabs.module';
import { ChipModule } from './components/chip/chip.module';
import { ControlTextModule } from './components/control-text/control-text.module';
import { DatagridModule } from './components/datagrid/datagrid.module';
import { DatepickerModule } from './components/datepicker/datepicker.module';
import { DaySelectorModule } from './components/day-selector/day-selector.module';
import { DraggableListModule } from './components/draggable-list/draggable-list.module';
import { DraggableModule } from './components/draggable/draggable.module';
import { DrawerModule } from './components/drawer/drawer.module';
import { DropdownMenuModule } from './components/dropdown-menu/dropdown-menu.module';
import { DropdownModule } from './components/dropdown/dropdown.module';
import { DroppableModule } from './components/droppable/droppable.module';
import { ExpansibleModule } from './components/expansible/expansible.module';
import { IconButtonModule } from './components/icon-button/icon-button.module';
import { InputModule } from './components/input/input.module';
import { LayoutModule } from './components/layout/layout.module';
import { ModalModule } from './components/modal/modal.module';
import { MultiselectionListModule } from './components/multiselection-list/multiselection-list.module';
import { RadioGroupModule } from './components/radio-group/radio-group.module';
import { RatingModule } from './components/rating/rating.module';
import { SearchFieldModule } from './components/search-field/search-field.module';
import { SelectMultipleModule } from './components/select-multiple/select-multiple.module';
import { SelectNewModule } from './components/select-new/select-new.module';
import { SelectModule } from './components/select/select.module';
import { SelectorModule } from './components/selector/selector.module';
import { SkeletonModule } from './components/skeleton/skeleton.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { SwitcherModule } from './components/switcher/switcher.module';
import { TabsModule } from './components/tabs/tabs.module';
import { TextareaModule } from './components/textarea/textarea.module';
import { TileModule } from './components/tile/tile.module';
import { TimeInputModule } from './components/time-input/time-input.module';
import { TooltipModule } from './components/tooltip/tooltip.module';
import { TreeModule } from './components/tree/tree.module';
import { VerticalTabsModule } from './components/vertical-tabs/vertical-tabs.module';
import { WasherModule } from './components/washer/washer.module';

const EXPORTS: any[] = [
  ExpansibleModule,
  ButtonModule,
  CheckboxModule,
  ChipButtonModule,
  ChipModule,
  ChipSelectModule,
  ChipTabsModule,
  ControlTextModule,
  DatagridModule,
  DatepickerModule,
  DaySelectorModule,
  DraggableModule,
  DrawerModule,
  DropdownModule,
  DroppableModule,
  IconButtonModule,
  InputModule,
  LayoutModule,
  ModalModule,
  RadioGroupModule,
  RatingModule,
  SearchFieldModule,
  SelectModule,
  SelectMultipleModule,
  SelectorModule,
  SpinnerModule,
  SwitcherModule,
  TabsModule,
  TextareaModule,
  TileModule,
  TimeInputModule,
  TooltipModule,
  DropdownMenuModule,
  TreeModule,
  WasherModule,
  MultiselectionListModule,
  VerticalTabsModule,
  SkeletonModule,
  DraggableListModule,
  SelectNewModule
];

@NgModule({
  imports: [SharedModule, ...EXPORTS],
  exports: [...EXPORTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}

import { NgModule } from '@angular/core';
import { HammerModule } from '@angular/platform-browser';
import { SharedModule } from '../internal/shared/shared.module';
import { AvatarModule } from './components/avatar/avatar.module';
import { ButtonModule } from './components/button/button.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { ChipButtonModule } from './components/chip-button/chip-button.module';
import { ChipTabsModule } from './components/chip-tabs/chip-tabs.module';
import { ChipModule } from './components/chip/chip.module';
import { ControlTextModule } from './components/control-text/control-text.module';
import { CounterModule } from './components/counter/counter.module';
import { DatagridModule } from './components/datagrid/datagrid.module';
import { DateTimePickerModule } from './components/date-time-picker/date-time-picker.module';
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
import { PagedVirtualScrollModule } from './components/paged-virtual-scroll/paged-virtual-scroll.module';
import { ProgressBarModule } from './components/progress-bar/progress-bar.module';
import { RadioGroupModule } from './components/radio-group/radio-group.module';
import { RatingModule } from './components/rating/rating.module';
import { SearchFieldModule } from './components/search-field/search-field.module';
import { SelectMultipleModule } from './components/select-multiple/select-multiple.module';
import { SelectModule } from './components/select/select.module';
import { SelectorModule } from './components/selector/selector.module';
import { SkeletonModule } from './components/skeleton/skeleton.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { SwitcherModule } from './components/switcher/switcher.module';
import { TableInputModule } from './components/table-input/table-input.module';
import { TabsModule } from './components/tabs/tabs.module';
import { TextareaModule } from './components/textarea/textarea.module';
import { ThemeWrapperModule } from './components/theme-wrapper/theme-wrapper.module';
import { TileModule } from './components/tile/tile.module';
import { TimeInputModule } from './components/time-input/time-input.module';
import { TooltipModule } from './components/tooltip/tooltip.module';
import { TreeNewModule } from './components/tree-new/tree-new.module';
import { TreeModule } from './components/tree/tree.module';
import { UploadsModule } from './components/uploads/uploads.module';
import { VerticalTabsModule } from './components/vertical-tabs/vertical-tabs.module';

const EXPORTS: any[] = [
  ExpansibleModule,
  ButtonModule,
  CheckboxModule,
  ChipButtonModule,
  ChipModule,
  ChipTabsModule,
  ControlTextModule,
  DatagridModule,
  DateTimePickerModule,
  DaySelectorModule,
  DraggableModule,
  DrawerModule,
  DropdownModule,
  DroppableModule,
  IconButtonModule,
  InputModule,
  TableInputModule,
  LayoutModule,
  ModalModule,
  RadioGroupModule,
  RatingModule,
  SearchFieldModule,
  SelectMultipleModule,
  SelectorModule,
  SpinnerModule,
  SwitcherModule,
  TabsModule,
  TextareaModule,
  ThemeWrapperModule,
  TileModule,
  TimeInputModule,
  TooltipModule,
  DropdownMenuModule,
  TreeModule,
  TreeNewModule,
  MultiselectionListModule,
  VerticalTabsModule,
  SkeletonModule,
  DraggableListModule,
  SelectModule,
  ProgressBarModule,
  UploadsModule,
  CounterModule,
  AvatarModule,
  PagedVirtualScrollModule
];

@NgModule({
  imports: [SharedModule, HammerModule, ...EXPORTS],
  exports: [...EXPORTS]
})
export class ComponentsModule {}

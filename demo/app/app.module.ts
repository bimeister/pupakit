import { registerLocaleData } from '@angular/common';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { ComponentsModule, IconModule } from './../../src/public-api';
import { AppComponent } from './app.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { ChipButtonDemoComponent } from './chip-button-demo/chip-button-demo.component';
import { ChipDemoComponent } from './chip-demo/chip-demo.component';
import { ChipSelectDemoComponent } from './chip-select-demo/chip-select-demo.component';
import { ChipSelectTreeDemoComponent } from './chip-select-tree-demo/chip-select-tree-demo.component';
import { ChipTabsDemoComponent } from './chip-tabs-demo/chip-tabs-demo.component';
import { DatagridDemoComponent } from './datagrid-demo/datagrid-demo.component';
import { DateTimePickerDemoComponent } from './date-time-picker-demo/date-time-picker-demo.component';
import { DaySelectorDemoComponent } from './day-selector-demo/day-selector-demo.component';
import { DraggableDemoComponent } from './draggable-demo/draggable-demo.component';
import { DraggableListDemoComponent } from './draggable-list-demo/draggable-demo.component';
import { TestDrawerComponent } from './drawer-demo/components/test-drawer/test-drawer.component';
import { DrawerDemoComponent } from './drawer-demo/drawer-demo.component';
import { DropdownDemoComponent } from './dropdown-demo/dropdown-demo.component';
import { DropdownMenuDemoComponent } from './dropdown-menu-demo/dropdown-menu-demo.component';
import { DroppableDemoComponent } from './droppable-demo/droppable-demo.component';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { LayoutDemoComponent } from './layout-demo/layout-demo.component';
import { LoaderDemoComponent } from './loader-demo/loader-demo.component';
import { LogPipe } from './log.pipe';
import { ModalDemoContentComponent } from './modal-demo/modal-demo-content/modal-demo-content.component';
import { ModalDemoComponent } from './modal-demo/modal-demo.component';
import { MultiselectionListDemoComponent } from './multiselection-list-demo/multiselection-list-demo.component';
import { RadioButtonDemoComponent } from './radio-button-demo/radio-button-demo.component';
import { RatingDemoComponent } from './rating-demo/rating-demo.component';
import { ScrollbarDemoComponent } from './scrollbar-demo/scrollbar-demo.component';
import { SearchFieldDemoComponent } from './search-field-demo/search-field-demo.component';
import { SelectDemoComponent } from './select-demo/select-demo.component';
import { SelectMultipleDemoComponent } from './select-multiple-demo/select-multiple-demo.component';
import { SelectorDemoComponent } from './selector-demo/selector-demo.component';
import { SpinnerDemoComponent } from './spinner-demo/spinner-demo.component';
import { SwitcherDemoComponent } from './switcher-demo/switcher-demo.component';
import { TableInputDemoComponent } from './table-input-demo/table-input-demo.component';
import { TabsDemoComponent } from './tabs-demo/tabs-demo.component';
import { TabsDrawerDemoComponent } from './tabs-drawer-demo/tabs-drawer-demo.component';
import { TextareaDemoComponent } from './textarea-demo/textarea-demo.component';
import { TileDemoComponent } from './tile-demo/tile-demo.component';
import { TimeInputDemoComponent } from './time-input-demo/time-input-demo.component';
import { TooltipDemoComponent } from './tooltip-demo/tooltip-demo.component';
import { TreeDemoComponent } from './tree-demo/tree-demo.component';
import { WasherPanelDemoComponent } from './washer-panel-demo/washer-panel-demo.component';
import { mdCloseCircleIcon } from '../../src/internal/constants/icons/md-close-circle-icon.const';
import { mdHelpCircleIcon } from '../../src/internal/constants/icons/md-help-circle-icon.const';
import { mdTrashIcon } from '../../src/internal/constants/icons/md-trash-icon.const';
import { mdMoreIcon } from '../../src/internal/constants/icons/md-more-icon.const';
import { mdSaveIcon } from '../../src/internal/constants/icons/md-save-icon.const';
import { iosCheckmarkIcon } from '../../src/internal/constants/icons/ios-checkmark-icon.const';
import { mdCheckmarkCircleIcon } from '../../src/internal/constants/icons/md-checkmark-circle-icon.const';
import { mdPizzaIcon } from '../../src/internal/constants/icons/md-pizza-icon.const';
import { mdPersonAddIcon } from '../../src/internal/constants/icons/md-person-add-icon.const';
import { mdManIcon } from '../../src/internal/constants/icons/md-man-icon.const';
import { mdAddIcon } from '../../src/internal/constants/icons/md-add-icon.const';
import { mdMoveIcon } from '../../src/internal/constants/icons/md-move-icon.const';
import { mdHomeIcon } from '../../src/internal/constants/icons/md-home-icon.const';
import { mdCloseIcon } from '../../src/internal/constants/icons/md-close-icon.const';

registerLocaleData(localeRu, 'ru-RU', localeRuExtra);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoaderDemoComponent,
    InputDemoComponent,
    TableInputDemoComponent,
    CheckboxDemoComponent,
    ButtonDemoComponent,
    DropdownDemoComponent,
    TileDemoComponent,
    TimeInputDemoComponent,
    SpinnerDemoComponent,
    SelectDemoComponent,
    IconButtonDemoComponent,
    SearchFieldDemoComponent,
    SwitcherDemoComponent,
    DroppableDemoComponent,
    RatingDemoComponent,
    DaySelectorDemoComponent,
    WasherPanelDemoComponent,
    IconButtonDemoComponent,
    ChipDemoComponent,
    ChipButtonDemoComponent,
    ChipSelectDemoComponent,
    ChipSelectTreeDemoComponent,
    ModalDemoComponent,
    ModalDemoContentComponent,
    DateTimePickerDemoComponent,
    ScrollbarDemoComponent,
    TabsDemoComponent,
    DatagridDemoComponent,
    DrawerDemoComponent,
    TextareaDemoComponent,
    TabsDrawerDemoComponent,
    RadioButtonDemoComponent,
    LayoutDemoComponent,
    DraggableDemoComponent,
    MultiselectionListDemoComponent,
    TooltipDemoComponent,
    DraggableListDemoComponent,
    DropdownMenuDemoComponent,
    SelectorDemoComponent,
    SelectMultipleDemoComponent,
    ChipTabsDemoComponent,
    TreeDemoComponent,
    LogPipe,
    TestDrawerComponent
  ],
  imports: [
    IconModule.forRoot([
      mdCloseCircleIcon,
      mdHelpCircleIcon,
      mdTrashIcon,
      mdMoreIcon,
      mdCloseCircleIcon,
      mdSaveIcon,
      iosCheckmarkIcon,
      mdCheckmarkCircleIcon,
      mdPizzaIcon,
      mdPersonAddIcon,
      mdManIcon,
      mdAddIcon,
      mdMoveIcon,
      mdHomeIcon,
      mdCloseIcon
    ]),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ComponentsModule,
    RouterModule.forRoot([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/loader'
      },
      {
        path: 'spinner',
        component: SpinnerDemoComponent
      },
      {
        path: 'chip-select-tree',
        component: ChipSelectTreeDemoComponent
      },
      {
        path: 'loader',
        component: LoaderDemoComponent
      },
      {
        path: 'button',
        component: ButtonDemoComponent
      },
      {
        path: 'chip',
        component: ChipDemoComponent
      },
      {
        path: 'chip-button',
        component: ChipButtonDemoComponent
      },
      {
        path: 'chip-select',
        component: ChipSelectDemoComponent
      },
      {
        path: 'chip-tabs',
        component: ChipTabsDemoComponent
      },
      {
        path: 'icon-button',
        component: IconButtonDemoComponent
      },
      {
        path: 'checkbox',
        component: CheckboxDemoComponent
      },
      {
        path: 'input',
        component: InputDemoComponent
      },
      {
        path: 'table-input',
        component: TableInputDemoComponent
      },
      {
        path: 'search-field',
        component: SearchFieldDemoComponent
      },
      {
        path: 'dropdown',
        component: DropdownDemoComponent
      },
      {
        path: 'tile',
        component: TileDemoComponent
      },
      {
        path: 'time-input',
        component: TimeInputDemoComponent
      },
      {
        path: 'tree',
        component: TreeDemoComponent
      },
      {
        path: 'select',
        component: SelectDemoComponent
      },
      {
        path: 'select-multiple',
        component: SelectMultipleDemoComponent
      },
      {
        path: 'switcher',
        component: SwitcherDemoComponent
      },
      {
        path: 'droppable',
        component: DroppableDemoComponent
      },
      {
        path: 'rating',
        component: RatingDemoComponent
      },
      {
        path: 'day-selector',
        component: DaySelectorDemoComponent
      },
      {
        path: 'draggable',
        component: DraggableDemoComponent
      },
      {
        path: 'date-time-picker',
        component: DateTimePickerDemoComponent
      },
      { path: 'washer-panel', component: WasherPanelDemoComponent },
      { path: 'scrollbar', component: ScrollbarDemoComponent },
      { path: 'modal', component: ModalDemoComponent },
      { path: 'tabs', component: TabsDemoComponent },
      { path: 'datagrid', component: DatagridDemoComponent },
      { path: 'drawer', component: DrawerDemoComponent },
      { path: 'textarea', component: TextareaDemoComponent },
      { path: 'tabs-drawer', component: TabsDrawerDemoComponent },
      { path: 'radio', component: RadioButtonDemoComponent },
      { path: 'layout', component: LayoutDemoComponent },
      { path: 'multiselection-list', component: MultiselectionListDemoComponent },
      { path: 'tooltip', component: TooltipDemoComponent },
      { path: 'draggable-list', component: DraggableListDemoComponent },
      { path: 'dropdown-menu', component: DropdownMenuDemoComponent },
      { path: 'selector', component: SelectorDemoComponent },
      {
        path: '',
        component: AppComponent
      }
    ])
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
  exports: [LogPipe]
})
export class AppModule {}

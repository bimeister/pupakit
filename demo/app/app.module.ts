import { registerLocaleData } from '@angular/common';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { getAllIcons } from '../declarations/functions/get-all-icons.function';
import { ComponentsModule, IconModule } from './../../src/public-api';
import { AppComponent } from './app.component';
import { AvatarDemoComponent } from './avatar-demo/avatar-demo.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { ChipButtonDemoComponent } from './chip-button-demo/chip-button-demo.component';
import { ChipDemoComponent } from './chip-demo/chip-demo.component';
import { ChipTabsDemoComponent } from './chip-tabs-demo/chip-tabs-demo.component';
import { ColorsComponent } from './colors/colors.component';
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
import { ExampleViewerModule } from './example-viewer/example-viewer.module';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';
import { IconPageComponent } from './icon-page/icon-page.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { LayoutDemoComponent } from './layout-demo/layout-demo.component';
import { LoaderDemoComponent } from './loader-demo/loader-demo.component';
import { LogPipe } from './log.pipe';
import { ModalDemoContentComponent } from './modal-demo/modal-demo-content/modal-demo-content.component';
import { ModalDemoComponent } from './modal-demo/modal-demo.component';
import { MultiselectionListDemoComponent } from './multiselection-list-demo/multiselection-list-demo.component';
import { PagedVirtualScrollDemoComponent } from './paged-virtual-scroll-demo/paged-virtual-scroll-demo.component';
import { RadioButtonDemoComponent } from './radio-button-demo/radio-button-demo.component';
import { RatingDemoComponent } from './rating-demo/rating-demo.component';
import { demoRoutes } from './routes';
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
import { TypographyPageComponent } from './typography-page/typography-page.component';
import { UploadsDemoComponent } from './uploads-demo/uploads-demo.component';

registerLocaleData(localeRu, 'ru-RU', localeRuExtra);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AvatarDemoComponent,
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
    ChipDemoComponent,
    ChipButtonDemoComponent,
    ModalDemoComponent,
    ModalDemoContentComponent,
    DateTimePickerDemoComponent,
    PagedVirtualScrollDemoComponent,
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
    TestDrawerComponent,
    UploadsDemoComponent,
    ColorsComponent,
    TypographyPageComponent,
    IconPageComponent
  ],
  imports: [
    IconModule.forRoot(getAllIcons()),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ComponentsModule,
    RouterModule.forRoot(demoRoutes, { relativeLinkResolution: 'legacy', useHash: true }),
    ExampleViewerModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
  exports: [LogPipe]
})
export class AppModule {}

import { registerLocaleData } from '@angular/common';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogPipe } from './log.pipe';
import { AvatarDemoComponent } from './pages/avatar-demo/avatar-demo.component';
import { ButtonDemoComponent } from './pages/button-demo/button-demo.component';
import { CheckboxDemoComponent } from './pages/checkbox-demo/checkbox-demo.component';
import { ChipButtonDemoComponent } from './pages/chip-button-demo/chip-button-demo.component';
import { ChipDemoComponent } from './pages/chip-demo/chip-demo.component';
import { ChipTabsDemoComponent } from './pages/chip-tabs-demo/chip-tabs-demo.component';
import { ColorsDemoComponent } from './pages/colors-demo/colors-demo.component';
import { ControlsIsPatchedDemoComponent } from './pages/controls-is-patched-demo/controls-is-patched-demo.component';
import { DatagridDemoComponent } from './pages/datagrid-demo/datagrid-demo.component';
import { DateTimePickerDemoComponent } from './pages/date-time-picker-demo/date-time-picker-demo.component';
import { DaySelectorDemoComponent } from './pages/day-selector-demo/day-selector-demo.component';
import { DraggableDemoComponent } from './pages/draggable-demo/draggable-demo.component';
import { DraggableListDemoComponent } from './pages/draggable-list-demo/draggable-demo.component';
import { TestDrawerComponent } from './pages/drawer-demo/components/test-drawer/test-drawer.component';
import { DrawerDemoComponent } from './pages/drawer-demo/drawer-demo.component';
import { DropdownDemoComponent } from './pages/dropdown-demo/dropdown-demo.component';
import { DropdownMenuDemoComponent } from './pages/dropdown-menu-demo/dropdown-menu-demo.component';
import { DroppableDemoComponent } from './pages/droppable-demo/droppable-demo.component';
import { FloatingCardDemoComponent } from './pages/floating-card-demo/floating-card-demo.component';
import { IconButtonDemoComponent } from './pages/icon-button-demo/icon-button-demo.component';
import { IconPageComponent } from './pages/icon-page/icon-page.component';
import { InputDemoComponent } from './pages/input-demo/input-demo.component';
import { LayoutDemoComponent } from './pages/layout-demo/layout-demo.component';
import { LoaderDemoComponent } from './pages/loader-demo/loader-demo.component';
import { ModalDemoContentComponent } from './pages/modal-demo/modal-demo-content/modal-demo-content.component';
import { ModalDemoComponent } from './pages/modal-demo/modal-demo.component';
import { MultiselectionListDemoComponent } from './pages/multiselection-list-demo/multiselection-list-demo.component';
import { PagedVirtualScrollDemoComponent } from './pages/paged-virtual-scroll-demo/paged-virtual-scroll-demo.component';
import { RadioButtonDemoComponent } from './pages/radio-button-demo/radio-button-demo.component';
import { RatingDemoComponent } from './pages/rating-demo/rating-demo.component';
import { ScrollbarDemoComponent } from './pages/scrollbar-demo/scrollbar-demo.component';
import { SearchFieldDemoComponent } from './pages/search-field-demo/search-field-demo.component';
import { SelectDemoComponent } from './pages/select-demo/select-demo.component';
import { SelectMultipleDemoComponent } from './pages/select-multiple-demo/select-multiple-demo.component';
import { SelectorDemoComponent } from './pages/selector-demo/selector-demo.component';
import { SpinnerDemoComponent } from './pages/spinner-demo/spinner-demo.component';
import { SwitcherDemoComponent } from './pages/switcher-demo/switcher-demo.component';
import { TableInputDemoComponent } from './pages/table-input-demo/table-input-demo.component';
import { TabsDemoComponent } from './pages/tabs-demo/tabs-demo.component';
import { TextareaDemoComponent } from './pages/textarea-demo/textarea-demo.component';
import { TileDemoComponent } from './pages/tile-demo/tile-demo.component';
import { TimeInputDemoComponent } from './pages/time-input-demo/time-input-demo.component';
import { TooltipDemoComponent } from './pages/tooltip-demo/tooltip-demo.component';
import { TreeDemoComponent } from './pages/tree-demo/tree-demo.component';
import { TreeNewDemoComponent } from './pages/tree-new-demo/tree-new-demo.component';
import { TypographyPageComponent } from './pages/typography-page/typography-page.component';
import { UploadsDemoComponent } from './pages/uploads-demo/uploads-demo.component';
import { VerticalTabsDemoComponent } from './pages/vertical-tabs-demo/vertical-tabs-demo.component';
import { DemoSharedModule } from './shared/shared.module';
import { TagDemoComponent } from './pages/tag-demo/tag-demo.component';

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
    TreeNewDemoComponent,
    LogPipe,
    TestDrawerComponent,
    UploadsDemoComponent,
    ColorsDemoComponent,
    TypographyPageComponent,
    IconPageComponent,
    VerticalTabsDemoComponent,
    ControlsIsPatchedDemoComponent,
    FloatingCardDemoComponent,
    TagDemoComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DemoSharedModule,
    AppRoutingModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
  exports: [LogPipe]
})
export class AppModule {}

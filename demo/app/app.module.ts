import { registerLocaleData } from '@angular/common';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeRu from '@angular/common/locales/ru';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { PupakitCore } from '../../src/lib/core/pupakit-core.module';
import { AppComponent } from './app.component';
import { ButtonDemoComponent } from './button-demo/button-demo.component';
import { CheckboxDemoComponent } from './checkbox-demo/checkbox-demo.component';
import { ChipButtonDemoComponent } from './chip-button-demo/chip-button-demo.component';
import { ChipDemoComponent } from './chip-demo/chip-demo.component';
import { ChipSelectDemoComponent } from './chip-select-demo/chip-select-demo.component';
import { DatagridDemoComponent } from './datagrid-demo/datagrid-demo.component';
import { DatepickerDemoComponent } from './datepicker-demo/datepicker-demo.component';
import { DaySelectorDemoComponent } from './day-selector-demo/day-selector-demo.component';
import { DrawerDemoComponent } from './drawer-demo/drawer-demo.component';
import { DropdownDemoComponent } from './dropdown-demo/dropdown-demo.component';
import { DroppableDemoComponent } from './droppable-demo/droppable-demo.component';
import { IconButtonDemoComponent } from './icon-button-demo/icon-button-demo.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { LoaderDemoComponent } from './loader-demo/loader-demo.component';
import { ModalDemoContentComponent } from './modal-demo/modal-demo-content/modal-demo-content.component';
import { ModalDemoComponent } from './modal-demo/modal-demo.component';
import { RatingDemoComponent } from './rating-demo/rating-demo.component';
import { ScrollbarDemoComponent } from './scrollbar-demo/scrollbar-demo.component';
import { SearchFieldDemoComponent } from './search-field-demo/search-field-demo.component';
import { SelectDemoComponent } from './select-demo/select-demo.component';
import { SpinnerDemoComponent } from './spinner-demo/spinner-demo.component';
import { SwitcherDemoComponent } from './switcher-demo/switcher-demo.component';
import { TabsDemoComponent } from './tabs-demo/tabs-demo.component';
import { TileDemoComponent } from './tile-demo/tile-demo.component';
import { TreeDemoComponent } from './tree-demo/tree-demo.component';
import { WasherPanelDemoComponent } from './washer-panel-demo/washer-panel-demo.component';
import { TextareaDemoComponent } from './textarea-demo/textarea-demo.component';
import { TabsDrawerDemoComponent } from './tabs-drawer-demo/tabs-drawer-demo.component';

registerLocaleData(localeRu, 'ru-RU', localeRuExtra);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    LoaderDemoComponent,
    InputDemoComponent,
    CheckboxDemoComponent,
    ButtonDemoComponent,
    DropdownDemoComponent,
    TileDemoComponent,
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
    TreeDemoComponent,
    ModalDemoComponent,
    ModalDemoContentComponent,
    DatepickerDemoComponent,
    ScrollbarDemoComponent,
    TabsDemoComponent,
    DatagridDemoComponent,
    DrawerDemoComponent,
    TextareaDemoComponent,
    TabsDrawerDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PupakitCore,
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
        path: 'tree',
        component: TreeDemoComponent
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
        path: 'select',
        component: SelectDemoComponent
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
        path: 'datepicker',
        component: DatepickerDemoComponent
      },
      { path: 'washer-panel', component: WasherPanelDemoComponent },
      { path: 'scrollbar', component: ScrollbarDemoComponent },
      { path: 'modal', component: ModalDemoComponent },
      { path: 'tabs', component: TabsDemoComponent },
      { path: 'datagrid', component: DatagridDemoComponent },
      { path: 'drawer', component: DrawerDemoComponent },
      { path: 'textarea', component: TextareaDemoComponent },
      { path: 'tabs-drawer', component: TabsDrawerDemoComponent },
      {
        path: '',
        component: AppComponent
      }
    ])
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}

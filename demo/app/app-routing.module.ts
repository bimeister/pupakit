import { NgModule, Type } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdaptiveDemoModule } from './pages/adaptive-demo/adaptive-demo.module';
import { AvatarDemoComponent } from './pages/avatar-demo/avatar-demo.component';
import { ButtonDemoComponent } from './pages/button-demo/button-demo.component';
import { CheckboxDemoComponent } from './pages/checkbox-demo/checkbox-demo.component';
import { ChipButtonDemoComponent } from './pages/chip-button-demo/chip-button-demo.component';
import { ChipDemoComponent } from './pages/chip-demo/chip-demo.component';
import { ChipTabsDemoComponent } from './pages/chip-tabs-demo/chip-tabs-demo.component';
import { CodeDemoModule } from './pages/code-demo/code-demo.module';
import { ColorsDemoComponent } from './pages/colors-demo/colors-demo.component';
import { ControlsIsPatchedDemoComponent } from './pages/controls-is-patched-demo/controls-is-patched-demo.component';
import { DatagridDemoComponent } from './pages/datagrid-demo/datagrid-demo.component';
import { DateTimePickerDemoComponent } from './pages/date-time-picker-demo/date-time-picker-demo.component';
import { DaySelectorDemoComponent } from './pages/day-selector-demo/day-selector-demo.component';
import { DraggableDemoComponent } from './pages/draggable-demo/draggable-demo.component';
import { DraggableListDemoComponent } from './pages/draggable-list-demo/draggable-demo.component';
import { DrawerDemoComponent } from './pages/drawer-demo/drawer-demo.component';
import { DropdownDemoComponent } from './pages/dropdown-demo/dropdown-demo.component';
import { DropdownMenuDemoComponent } from './pages/dropdown-menu-demo/dropdown-menu-demo.component';
import { DroppableDemoComponent } from './pages/droppable-demo/droppable-demo.component';
import { IconButtonDemoComponent } from './pages/icon-button-demo/icon-button-demo.component';
import { IconPageComponent } from './pages/icon-page/icon-page.component';
import { InputDemoComponent } from './pages/input-demo/input-demo.component';
import { LayoutDemoComponent } from './pages/layout-demo/layout-demo.component';
import { LoaderDemoComponent } from './pages/loader-demo/loader-demo.component';
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

const demoRoutes: Routes = [
  {
    path: 'avatar',
    component: AvatarDemoComponent
  },
  {
    path: 'typography',
    component: TypographyPageComponent
  },
  {
    path: 'colors',
    component: ColorsDemoComponent
  },
  {
    path: 'icon',
    component: IconPageComponent
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
    path: 'tree-new',
    component: TreeNewDemoComponent
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
  {
    path: 'paged-virtual-scroll',
    component: PagedVirtualScrollDemoComponent
  },
  { path: 'scrollbar', component: ScrollbarDemoComponent },
  { path: 'modal', component: ModalDemoComponent },
  { path: 'tabs', component: TabsDemoComponent },
  { path: 'datagrid', component: DatagridDemoComponent },
  { path: 'drawer', component: DrawerDemoComponent },
  { path: 'textarea', component: TextareaDemoComponent },
  { path: 'radio', component: RadioButtonDemoComponent },
  { path: 'layout', component: LayoutDemoComponent },
  { path: 'multiselection-list', component: MultiselectionListDemoComponent },
  { path: 'tooltip', component: TooltipDemoComponent },
  { path: 'draggable-list', component: DraggableListDemoComponent },
  { path: 'dropdown-menu', component: DropdownMenuDemoComponent },
  { path: 'selector', component: SelectorDemoComponent },
  {
    path: 'uploads',
    component: UploadsDemoComponent
  },
  {
    path: 'vertical-tabs',
    component: VerticalTabsDemoComponent
  },
  {
    path: 'controls-is-patched',
    component: ControlsIsPatchedDemoComponent
  },
  {
    path: 'adaptive',
    loadChildren: (): Promise<Type<AdaptiveDemoModule>> =>
      import('./pages/adaptive-demo/adaptive-demo.module').then(module => module.AdaptiveDemoModule)
  },
  {
    path: 'code',
    loadChildren: (): Promise<Type<CodeDemoModule>> =>
      import('./pages/code-demo/code-demo.module').then(module => module.CodeDemoModule)
  },
  {
    path: '',
    redirectTo: '/typography',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(demoRoutes, {
      enableTracing: false,
      onSameUrlNavigation: 'reload',
      urlUpdateStrategy: 'deferred',
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledNonBlocking',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

import { NgModule, Type } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { KitLayoutComponent } from './layouts/kit-layout/kit-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ActionsDemoModule } from './pages/actions-demo/actions-demo.module';
import { AdaptiveDemoModule } from './pages/adaptive-demo/adaptive-demo.module';
import { AvatarDemoModule } from './pages/avatar-demo/avatar-demo.module';
import { BadgeDemoModule } from './pages/badge-demo/badge-demo.module';
import { BreadcrumbsDemoModule } from './pages/breadcrumbs-demo/breadcrumbs-demo.module';
import { ButtonDemoModule } from './pages/button-demo/button-demo.module';
import { ButtonGroupDemoModule } from './pages/button-group-demo/button-group-demo.module';
import { ButtonMultiDemoModule } from './pages/button-multi-demo/button-multi-demo.module';
import { CheckboxDemoModule } from './pages/checkbox-demo/checkbox-demo.module';
import { ChipDemoModule } from './pages/chip-demo/chip-demo.module';
import { ChipTabsDemoModule } from './pages/chip-tabs-demo/chip-tabs-demo.module';
import { CodeDemoModule } from './pages/code-demo/code-demo.module';
import { ColorsDemoModule } from './pages/colors-demo/colors-demo.module';
import { CounterDemoModule } from './pages/counter-demo/counter-demo.module';
import { DatagridDemoModule } from './pages/datagrid-demo/datagrid-demo.module';
import { DateTimePickerDemoModule } from './pages/date-time-picker-demo/date-time-picker-demo.module';
import { DraggableDemoModule } from './pages/draggable-demo/draggable-demo.module';
import { DraggableListDemoModule } from './pages/draggable-list-demo/draggable-list-demo.module';
import { DrawerDemoModule } from './pages/drawer-demo/drawer-demo.module';
import { DrawerOldDemoModule } from './pages/drawer-old-demo/drawer-old-demo.module';
import { DropdownMenuDemoModule } from './pages/dropdown-menu-demo/dropdown-menu-demo.module';
import { DroppableDemoModule } from './pages/droppable-demo/droppable-demo.module';
import { FloatingCardDemoModule } from './pages/floating-card-demo/floating-card-demo.module';
import { IconButtonDemoModule } from './pages/icon-button-demo/icon-button-demo.module';
import { IconPageModule } from './pages/icon-page/icon-page.module';
import { InfoBlockDemoModule } from './pages/info-block-demo/info-block-demo.module';
import { InputDemoModule } from './pages/input-demo/input-demo.module';
import { LabelDemoModule } from './pages/label-demo/label-demo.module';
import { LayoutDemoModule } from './pages/layout-demo/layout-demo.module';
import { LoaderDemoModule } from './pages/loader-demo/loader-demo.module';
import { MainPageModule } from './pages/main-page/main-page.module';
import { ModalDemoModule } from './pages/modal-demo/modal-demo.module';
import { NotFoundPageModule } from './pages/not-found-page/not-found-page.module';
import { PagedVirtualScrollDemoModule } from './pages/paged-virtual-scroll-demo/paged-virtual-scroll-demo.module';
import { RadioButtonDemoModule } from './pages/radio-button-demo/radio-button-demo.module';
import { RatingDemoModule } from './pages/rating-demo/rating-demo.module';
import { ScrollableDemoModule } from './pages/scrollable-demo/scrollable-demo.module';
import { ScrollbarDemoModule } from './pages/scrollbar-demo/scrollbar-demo.module';
import { SearchFieldDemoModule } from './pages/search-field-demo/search-field-demo.module';
import { SelectDemoModule } from './pages/select-demo/select-demo.module';
import { SelectorDemoModule } from './pages/selector-demo/selector-demo.module';
import { SpinnerDemoModule } from './pages/spinner-demo/spinner-demo.module';
import { StatusDemoModule } from './pages/status-demo/status-demo.module';
import { StepperDemoModule } from './pages/stepper-demo/stepper-demo.module';
import { SwitcherDemoModule } from './pages/switcher-demo/switcher-demo.module';
import { TableDemoModule } from './pages/table-demo/table-demo.module';
import { TabsDemoModule } from './pages/tabs-demo/tabs-demo.module';
import { TagDemoModule } from './pages/tag-demo/tag-demo.module';
import { TextareaDemoModule } from './pages/textarea-demo/textarea-demo.module';
import { TooltipDemoModule } from './pages/tooltip-demo/tooltip-demo.module';
import { TreeDemoModule } from './pages/tree-demo/tree-demo.module';
import { TreeNewDemoModule } from './pages/tree-new-demo/tree-new-demo.module';
import { TypographyPageModule } from './pages/typography-page/typography-page.module';
import { UploadsDemoModule } from './pages/uploads-demo/uploads-demo.module';
import { VerticalTabsDemoModule } from './pages/vertical-tabs-demo/vertical-tabs-demo.module';

const demoRoutes: Routes = [
  {
    path: 'kit',
    component: KitLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'typography',
      },
      {
        path: 'typography',
        loadChildren: (): Promise<Type<TypographyPageModule>> =>
          import('./pages/typography-page/typography-page.module').then((module: any) => module.TypographyPageModule),
      },
      {
        path: 'actions',
        loadChildren: (): Promise<Type<ActionsDemoModule>> =>
          import('./pages/actions-demo/actions-demo.module').then((module: any) => module.ActionsDemoModule),
      },
      {
        path: 'avatar',
        loadChildren: (): Promise<Type<AvatarDemoModule>> =>
          import('./pages/avatar-demo/avatar-demo.module').then((module: any) => module.AvatarDemoModule),
      },
      {
        path: 'colors',
        loadChildren: (): Promise<Type<ColorsDemoModule>> =>
          import('./pages/colors-demo/colors-demo.module').then((module: any) => module.ColorsDemoModule),
      },
      {
        path: 'icon',
        loadChildren: (): Promise<Type<IconPageModule>> =>
          import('./pages/icon-page/icon-page.module').then((module: any) => module.IconPageModule),
      },
      {
        path: 'spinner',
        loadChildren: (): Promise<Type<SpinnerDemoModule>> =>
          import('./pages/spinner-demo/spinner-demo.module').then((module: any) => module.SpinnerDemoModule),
      },
      {
        path: 'loader',
        loadChildren: (): Promise<Type<LoaderDemoModule>> =>
          import('./pages/loader-demo/loader-demo.module').then((module: any) => module.LoaderDemoModule),
      },
      {
        path: 'button',
        loadChildren: (): Promise<Type<ButtonDemoModule>> =>
          import('./pages/button-demo/button-demo.module').then((module: any) => module.ButtonDemoModule),
      },
      {
        path: 'button-multi',
        loadChildren: (): Promise<Type<ButtonMultiDemoModule>> =>
          import('./pages/button-multi-demo/button-multi-demo.module').then(
            (module: any) => module.ButtonMultiDemoModule
          ),
      },
      {
        path: 'chip',
        loadChildren: (): Promise<Type<ChipDemoModule>> =>
          import('./pages/chip-demo/chip-demo.module').then((module: any) => module.ChipDemoModule),
      },
      {
        path: 'chip-tabs',
        loadChildren: (): Promise<Type<ChipTabsDemoModule>> =>
          import('./pages/chip-tabs-demo/chip-tabs-demo.module').then((module: any) => module.ChipTabsDemoModule),
      },
      {
        path: 'icon-button',
        loadChildren: (): Promise<Type<IconButtonDemoModule>> =>
          import('./pages/icon-button-demo/icon-button-demo.module').then((module: any) => module.IconButtonDemoModule),
      },
      {
        path: 'checkbox',
        loadChildren: (): Promise<Type<CheckboxDemoModule>> =>
          import('./pages/checkbox-demo/checkbox-demo.module').then((module: any) => module.CheckboxDemoModule),
      },
      {
        path: 'input',
        loadChildren: (): Promise<Type<InputDemoModule>> =>
          import('./pages/input-demo/input-demo.module').then((module: any) => module.InputDemoModule),
      },
      {
        path: 'label',
        loadChildren: (): Promise<Type<LabelDemoModule>> =>
          import('./pages/label-demo/label-demo.module').then((module: any) => module.LabelDemoModule),
      },
      {
        path: 'search-field',
        loadChildren: (): Promise<Type<SearchFieldDemoModule>> =>
          import('./pages/search-field-demo/search-field-demo.module').then(
            (module: any) => module.SearchFieldDemoModule
          ),
      },
      {
        path: 'tree',
        loadChildren: (): Promise<Type<TreeDemoModule>> =>
          import('./pages/tree-demo/tree-demo.module').then((module: any) => module.TreeDemoModule),
      },
      {
        path: 'tree-new',
        loadChildren: (): Promise<Type<TreeNewDemoModule>> =>
          import('./pages/tree-new-demo/tree-new-demo.module').then((module: any) => module.TreeNewDemoModule),
      },
      {
        path: 'select',
        loadChildren: (): Promise<Type<SelectDemoModule>> =>
          import('./pages/select-demo/select-demo.module').then((module: any) => module.SelectDemoModule),
      },
      {
        path: 'switcher',
        loadChildren: (): Promise<Type<SwitcherDemoModule>> =>
          import('./pages/switcher-demo/switcher-demo.module').then((module: any) => module.SwitcherDemoModule),
      },
      {
        path: 'droppable',
        loadChildren: (): Promise<Type<DroppableDemoModule>> =>
          import('./pages/droppable-demo/droppable-demo.module').then((module: any) => module.DroppableDemoModule),
      },
      {
        path: 'rating',
        loadChildren: (): Promise<Type<RatingDemoModule>> =>
          import('./pages/rating-demo/rating-demo.module').then((module: any) => module.RatingDemoModule),
      },
      {
        path: 'draggable',
        loadChildren: (): Promise<Type<DraggableDemoModule>> =>
          import('./pages/draggable-demo/draggable-demo.module').then((module: any) => module.DraggableDemoModule),
      },
      {
        path: 'date-time-picker',
        loadChildren: (): Promise<Type<DateTimePickerDemoModule>> =>
          import('./pages/date-time-picker-demo/date-time-picker-demo.module').then(
            (module: any) => module.DateTimePickerDemoModule
          ),
      },
      {
        path: 'paged-virtual-scroll',
        loadChildren: (): Promise<Type<PagedVirtualScrollDemoModule>> =>
          import('./pages/paged-virtual-scroll-demo/paged-virtual-scroll-demo.module').then(
            (module: any) => module.PagedVirtualScrollDemoModule
          ),
      },
      {
        path: 'scrollbar',
        loadChildren: (): Promise<Type<ScrollbarDemoModule>> =>
          import('./pages/scrollbar-demo/scrollbar-demo.module').then((module: any) => module.ScrollbarDemoModule),
      },
      {
        path: 'modal',
        loadChildren: (): Promise<Type<ModalDemoModule>> =>
          import('./pages/modal-demo/modal-demo.module').then((module: any) => module.ModalDemoModule),
      },
      {
        path: 'tabs',
        loadChildren: (): Promise<Type<TabsDemoModule>> =>
          import('./pages/tabs-demo/tabs-demo.module').then((module: any) => module.TabsDemoModule),
      },
      {
        path: 'stepper',
        loadChildren: (): Promise<Type<StepperDemoModule>> =>
          import('./pages/stepper-demo/stepper-demo.module').then((module: any) => module.StepperDemoModule),
      },
      {
        path: 'datagrid',
        loadChildren: (): Promise<Type<DatagridDemoModule>> =>
          import('./pages/datagrid-demo/datagrid-demo.module').then((module: any) => module.DatagridDemoModule),
      },
      {
        path: 'drawer-old',
        loadChildren: (): Promise<Type<DrawerOldDemoModule>> =>
          import('./pages/drawer-old-demo/drawer-old-demo.module').then((module: any) => module.DrawerOldDemoModule),
      },
      {
        path: 'drawer',
        loadChildren: (): Promise<Type<DrawerDemoModule>> =>
          import('./pages/drawer-demo/drawer-demo.module').then((module: any) => module.DrawerDemoModule),
      },
      {
        path: 'textarea',
        loadChildren: (): Promise<Type<TextareaDemoModule>> =>
          import('./pages/textarea-demo/textarea-demo.module').then((module: any) => module.TextareaDemoModule),
      },
      {
        path: 'radio',
        loadChildren: (): Promise<Type<RadioButtonDemoModule>> =>
          import('./pages/radio-button-demo/radio-button-demo.module').then(
            (module: any) => module.RadioButtonDemoModule
          ),
      },
      {
        path: 'layout',
        loadChildren: (): Promise<Type<LayoutDemoModule>> =>
          import('./pages/layout-demo/layout-demo.module').then((module: any) => module.LayoutDemoModule),
      },
      {
        path: 'tooltip',
        loadChildren: (): Promise<Type<TooltipDemoModule>> =>
          import('./pages/tooltip-demo/tooltip-demo.module').then((module: any) => module.TooltipDemoModule),
      },
      {
        path: 'draggable-list',
        loadChildren: (): Promise<Type<DraggableListDemoModule>> =>
          import('./pages/draggable-list-demo/draggable-list-demo.module').then(
            (module: any) => module.DraggableListDemoModule
          ),
      },
      {
        path: 'dropdown-menu',
        loadChildren: (): Promise<Type<DropdownMenuDemoModule>> =>
          import('./pages/dropdown-menu-demo/dropdown-menu-demo.module').then(
            (module: any) => module.DropdownMenuDemoModule
          ),
      },
      {
        path: 'selector',
        loadChildren: (): Promise<Type<SelectorDemoModule>> =>
          import('./pages/selector-demo/selector-demo.module').then((module: any) => module.SelectorDemoModule),
      },
      {
        path: 'uploads',
        loadChildren: (): Promise<Type<UploadsDemoModule>> =>
          import('./pages/uploads-demo/uploads-demo.module').then((module: any) => module.UploadsDemoModule),
      },
      {
        path: 'vertical-tabs',
        loadChildren: (): Promise<Type<VerticalTabsDemoModule>> =>
          import('./pages/vertical-tabs-demo/vertical-tabs-demo.module').then(
            (module: any) => module.VerticalTabsDemoModule
          ),
      },
      {
        path: 'floating-card',
        loadChildren: (): Promise<Type<FloatingCardDemoModule>> =>
          import('./pages/floating-card-demo/floating-card-demo.module').then(
            (module: any) => module.FloatingCardDemoModule
          ),
      },
      {
        path: 'adaptive',
        loadChildren: (): Promise<Type<AdaptiveDemoModule>> =>
          import('./pages/adaptive-demo/adaptive-demo.module').then((module: any) => module.AdaptiveDemoModule),
      },
      {
        path: 'code',
        loadChildren: (): Promise<Type<CodeDemoModule>> =>
          import('./pages/code-demo/code-demo.module').then((module: any) => module.CodeDemoModule),
      },
      {
        path: 'table',
        loadChildren: (): Promise<Type<TableDemoModule>> =>
          import('./pages/table-demo/table-demo.module').then((module: any) => module.TableDemoModule),
      },
      {
        path: 'tag',
        loadChildren: (): Promise<Type<TagDemoModule>> =>
          import('./pages/tag-demo/tag-demo.module').then((module: any) => module.TagDemoModule),
      },
      {
        path: 'scrollable',
        loadChildren: (): Promise<Type<ScrollableDemoModule>> =>
          import('./pages/scrollable-demo/scrollable-demo.module').then((module: any) => module.ScrollableDemoModule),
      },
      {
        path: 'info-block',
        loadChildren: (): Promise<Type<InfoBlockDemoModule>> =>
          import('./pages/info-block-demo/info-block-demo.module').then((module: any) => module.InfoBlockDemoModule),
      },
      {
        path: 'status',
        loadChildren: (): Promise<Type<StatusDemoModule>> =>
          import('./pages/status-demo/status-demo.module').then((module: any) => module.StatusDemoModule),
      },
      {
        path: 'badge',
        loadChildren: (): Promise<Type<BadgeDemoModule>> =>
          import('./pages/badge-demo/badge-demo.module').then((module: any) => module.BadgeDemoModule),
      },
      {
        path: 'breadcrumbs',
        loadChildren: (): Promise<Type<BreadcrumbsDemoModule>> =>
          import('./pages/breadcrumbs-demo/breadcrumbs-demo.module').then(
            (module: any) => module.BreadcrumbsDemoModule
          ),
      },
      {
        path: 'button-group',
        loadChildren: (): Promise<Type<ButtonGroupDemoModule>> =>
          import('./pages/button-group-demo/button-group-demo.module').then(
            (module: any) => module.ButtonGroupDemoModule
          ),
      },
      {
        path: 'alerts',
        loadChildren: () =>
          import('./pages/alerts-demo/alerts-demo.module').then((module: any) => module.AlertsDemoModule),
      },
      {
        path: 'toasts',
        loadChildren: () =>
          import('./pages/toasts-demo/toasts-demo.module').then((module: any) => module.ToastsDemoModule),
      },
      {
        path: 'link',
        loadChildren: () => import('./pages/link-demo/link-demo.module').then((module: any) => module.LinkDemoModule),
      },
      {
        path: 'timer',
        loadChildren: () =>
          import('./pages/timer-demo/timer-demo.module').then((module: any) => module.TimerDemoModule),
      },
      {
        path: 'counter',
        loadChildren: (): Promise<Type<CounterDemoModule>> =>
          import('./pages/counter-demo/counter-demo.module').then((module: any) => module.CounterDemoModule),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: (): Promise<Type<MainPageModule>> =>
      import('./pages/main-page/main-page.module').then((module: any) => module.MainPageModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '**',
        loadChildren: (): Promise<Type<NotFoundPageModule>> =>
          import('./pages/not-found-page/not-found-page.module').then((module: any) => module.NotFoundPageModule),
      },
    ],
  },
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
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

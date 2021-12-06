import { NgModule, Type } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { KitLayoutComponent } from './layouts/kit-layout/kit-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
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
import { ControlsIsPatchedDemoModule } from './pages/controls-is-patched-demo/controls-is-patched-demo.module';
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
        redirectTo: 'typography'
      },
      {
        path: 'typography',
        loadChildren: (): Promise<Type<TypographyPageModule>> =>
          import('./pages/typography-page/typography-page.module').then(module => module.TypographyPageModule)
      },
      {
        path: 'avatar',
        loadChildren: (): Promise<Type<AvatarDemoModule>> =>
          import('./pages/avatar-demo/avatar-demo.module').then(module => module.AvatarDemoModule)
      },
      {
        path: 'colors',
        loadChildren: (): Promise<Type<ColorsDemoModule>> =>
          import('./pages/colors-demo/colors-demo.module').then(module => module.ColorsDemoModule)
      },
      {
        path: 'icon',
        loadChildren: (): Promise<Type<IconPageModule>> =>
          import('./pages/icon-page/icon-page.module').then(module => module.IconPageModule)
      },
      {
        path: 'spinner',
        loadChildren: (): Promise<Type<SpinnerDemoModule>> =>
          import('./pages/spinner-demo/spinner-demo.module').then(module => module.SpinnerDemoModule)
      },
      {
        path: 'loader',
        loadChildren: (): Promise<Type<LoaderDemoModule>> =>
          import('./pages/loader-demo/loader-demo.module').then(module => module.LoaderDemoModule)
      },
      {
        path: 'button',
        loadChildren: (): Promise<Type<ButtonDemoModule>> =>
          import('./pages/button-demo/button-demo.module').then(module => module.ButtonDemoModule)
      },
      {
        path: 'button-multi',
        loadChildren: (): Promise<Type<ButtonMultiDemoModule>> =>
          import('./pages/button-multi-demo/button-multi-demo.module').then(module => module.ButtonMultiDemoModule)
      },
      {
        path: 'chip',
        loadChildren: (): Promise<Type<ChipDemoModule>> =>
          import('./pages/chip-demo/chip-demo.module').then(module => module.ChipDemoModule)
      },
      {
        path: 'chip-tabs',
        loadChildren: (): Promise<Type<ChipTabsDemoModule>> =>
          import('./pages/chip-tabs-demo/chip-tabs-demo.module').then(module => module.ChipTabsDemoModule)
      },
      {
        path: 'icon-button',
        loadChildren: (): Promise<Type<IconButtonDemoModule>> =>
          import('./pages/icon-button-demo/icon-button-demo.module').then(module => module.IconButtonDemoModule)
      },
      {
        path: 'checkbox',
        loadChildren: (): Promise<Type<CheckboxDemoModule>> =>
          import('./pages/checkbox-demo/checkbox-demo.module').then(module => module.CheckboxDemoModule)
      },
      {
        path: 'input',
        loadChildren: (): Promise<Type<InputDemoModule>> =>
          import('./pages/input-demo/input-demo.module').then(module => module.InputDemoModule)
      },
      {
        path: 'label',
        loadChildren: (): Promise<Type<LabelDemoModule>> =>
          import('./pages/label-demo/label-demo.module').then(module => module.LabelDemoModule)
      },
      {
        path: 'search-field',
        loadChildren: (): Promise<Type<SearchFieldDemoModule>> =>
          import('./pages/search-field-demo/search-field-demo.module').then(module => module.SearchFieldDemoModule)
      },
      {
        path: 'tree',
        loadChildren: (): Promise<Type<TreeDemoModule>> =>
          import('./pages/tree-demo/tree-demo.module').then(module => module.TreeDemoModule)
      },
      {
        path: 'tree-new',
        loadChildren: (): Promise<Type<TreeNewDemoModule>> =>
          import('./pages/tree-new-demo/tree-new-demo.module').then(module => module.TreeNewDemoModule)
      },
      {
        path: 'select',
        loadChildren: (): Promise<Type<SelectDemoModule>> =>
          import('./pages/select-demo/select-demo.module').then(module => module.SelectDemoModule)
      },
      {
        path: 'switcher',
        loadChildren: (): Promise<Type<SwitcherDemoModule>> =>
          import('./pages/switcher-demo/switcher-demo.module').then(module => module.SwitcherDemoModule)
      },
      {
        path: 'droppable',
        loadChildren: (): Promise<Type<DroppableDemoModule>> =>
          import('./pages/droppable-demo/droppable-demo.module').then(module => module.DroppableDemoModule)
      },
      {
        path: 'rating',
        loadChildren: (): Promise<Type<RatingDemoModule>> =>
          import('./pages/rating-demo/rating-demo.module').then(module => module.RatingDemoModule)
      },
      {
        path: 'draggable',
        loadChildren: (): Promise<Type<DraggableDemoModule>> =>
          import('./pages/draggable-demo/draggable-demo.module').then(module => module.DraggableDemoModule)
      },
      {
        path: 'date-time-picker',
        loadChildren: (): Promise<Type<DateTimePickerDemoModule>> =>
          import('./pages/date-time-picker-demo/date-time-picker-demo.module').then(
            module => module.DateTimePickerDemoModule
          )
      },
      {
        path: 'paged-virtual-scroll',
        loadChildren: (): Promise<Type<PagedVirtualScrollDemoModule>> =>
          import('./pages/paged-virtual-scroll-demo/paged-virtual-scroll-demo.module').then(
            module => module.PagedVirtualScrollDemoModule
          )
      },
      {
        path: 'scrollbar',
        loadChildren: (): Promise<Type<ScrollbarDemoModule>> =>
          import('./pages/scrollbar-demo/scrollbar-demo.module').then(module => module.ScrollbarDemoModule)
      },
      {
        path: 'modal',
        loadChildren: (): Promise<Type<ModalDemoModule>> =>
          import('./pages/modal-demo/modal-demo.module').then(module => module.ModalDemoModule)
      },
      {
        path: 'tabs',
        loadChildren: (): Promise<Type<TabsDemoModule>> =>
          import('./pages/tabs-demo/tabs-demo.module').then(module => module.TabsDemoModule)
      },
      {
        path: 'datagrid',
        loadChildren: (): Promise<Type<DatagridDemoModule>> =>
          import('./pages/datagrid-demo/datagrid-demo.module').then(module => module.DatagridDemoModule)
      },
      {
        path: 'drawer-old',
        loadChildren: (): Promise<Type<DrawerOldDemoModule>> =>
          import('./pages/drawer-old-demo/drawer-old-demo.module').then(module => module.DrawerOldDemoModule)
      },
      {
        path: 'drawer',
        loadChildren: (): Promise<Type<DrawerDemoModule>> =>
          import('./pages/drawer-demo/drawer-demo.module').then(module => module.DrawerDemoModule)
      },
      {
        path: 'textarea',
        loadChildren: (): Promise<Type<TextareaDemoModule>> =>
          import('./pages/textarea-demo/textarea-demo.module').then(module => module.TextareaDemoModule)
      },
      {
        path: 'radio',
        loadChildren: (): Promise<Type<RadioButtonDemoModule>> =>
          import('./pages/radio-button-demo/radio-button-demo.module').then(module => module.RadioButtonDemoModule)
      },
      {
        path: 'layout',
        loadChildren: (): Promise<Type<LayoutDemoModule>> =>
          import('./pages/layout-demo/layout-demo.module').then(module => module.LayoutDemoModule)
      },
      {
        path: 'tooltip',
        loadChildren: (): Promise<Type<TooltipDemoModule>> =>
          import('./pages/tooltip-demo/tooltip-demo.module').then(module => module.TooltipDemoModule)
      },
      {
        path: 'draggable-list',
        loadChildren: (): Promise<Type<DraggableListDemoModule>> =>
          import('./pages/draggable-list-demo/draggable-list-demo.module').then(
            module => module.DraggableListDemoModule
          )
      },
      {
        path: 'dropdown-menu',
        loadChildren: (): Promise<Type<DropdownMenuDemoModule>> =>
          import('./pages/dropdown-menu-demo/dropdown-menu-demo.module').then(module => module.DropdownMenuDemoModule)
      },
      {
        path: 'selector',
        loadChildren: (): Promise<Type<SelectorDemoModule>> =>
          import('./pages/selector-demo/selector-demo.module').then(module => module.SelectorDemoModule)
      },
      {
        path: 'uploads',
        loadChildren: (): Promise<Type<UploadsDemoModule>> =>
          import('./pages/uploads-demo/uploads-demo.module').then(module => module.UploadsDemoModule)
      },
      {
        path: 'vertical-tabs',
        loadChildren: (): Promise<Type<VerticalTabsDemoModule>> =>
          import('./pages/vertical-tabs-demo/vertical-tabs-demo.module').then(module => module.VerticalTabsDemoModule)
      },
      {
        path: 'controls-is-patched',
        loadChildren: (): Promise<Type<ControlsIsPatchedDemoModule>> =>
          import('./pages/controls-is-patched-demo/controls-is-patched-demo.module').then(
            module => module.ControlsIsPatchedDemoModule
          )
      },
      {
        path: 'floating-card',
        loadChildren: (): Promise<Type<FloatingCardDemoModule>> =>
          import('./pages/floating-card-demo/floating-card-demo.module').then(module => module.FloatingCardDemoModule)
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
        path: 'table',
        loadChildren: (): Promise<Type<TableDemoModule>> =>
          import('./pages/table-demo/table-demo.module').then(module => module.TableDemoModule)
      },
      {
        path: 'tag',
        loadChildren: (): Promise<Type<TagDemoModule>> =>
          import('./pages/tag-demo/tag-demo.module').then(module => module.TagDemoModule)
      },
      {
        path: 'scrollable',
        loadChildren: (): Promise<Type<ScrollableDemoModule>> =>
          import('./pages/scrollable-demo/scrollable-demo.module').then(module => module.ScrollableDemoModule)
      },
      {
        path: 'info-block',
        loadChildren: (): Promise<Type<InfoBlockDemoModule>> =>
          import('./pages/info-block-demo/info-block-demo.module').then(module => module.InfoBlockDemoModule)
      },
      {
        path: 'status',
        loadChildren: (): Promise<Type<StatusDemoModule>> =>
          import('./pages/status-demo/status-demo.module').then(module => module.StatusDemoModule)
      },
      {
        path: 'badge',
        loadChildren: (): Promise<Type<BadgeDemoModule>> =>
          import('./pages/badge-demo/badge-demo.module').then(module => module.BadgeDemoModule)
      },
      {
        path: 'breadcrumbs',
        loadChildren: (): Promise<Type<BreadcrumbsDemoModule>> =>
          import('./pages/breadcrumbs-demo/breadcrumbs-demo.module').then(module => module.BreadcrumbsDemoModule)
      },
      {
        path: 'button-group',
        loadChildren: (): Promise<Type<ButtonGroupDemoModule>> =>
          import('./pages/button-group-demo/button-group-demo.module').then(module => module.ButtonGroupDemoModule)
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: (): Promise<Type<MainPageModule>> =>
      import('./pages/main-page/main-page.module').then(module => module.MainPageModule)
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '**',
        loadChildren: (): Promise<Type<NotFoundPageModule>> =>
          import('./pages/not-found-page/not-found-page.module').then(module => module.NotFoundPageModule)
      }
    ]
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

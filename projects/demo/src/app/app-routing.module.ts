import { NgModule, Type } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { KitLayoutComponent } from './layouts/kit-layout/kit-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AccordionDemoModule } from './pages/accordion-demo/accordion-demo.module';
import { ActionsDemoModule } from './pages/actions-demo/actions-demo.module';
import { AdaptiveDemoModule } from './pages/adaptive-demo/adaptive-demo.module';
import { AvatarDemoModule } from './pages/avatar-demo/avatar-demo.module';
import { BadgeDemoModule } from './pages/badge-demo/badge-demo.module';
import { BreadcrumbsDemoModule } from './pages/breadcrumbs-demo/breadcrumbs-demo.module';
import { ButtonDemoModule } from './pages/button-demo/button-demo.module';
import { ButtonGroupDemoModule } from './pages/button-group-demo/button-group-demo.module';
import { ButtonIconDemoModule } from './pages/button-icon-demo/button-icon-demo.module';
import { ButtonMultiDemoModule } from './pages/button-multi-demo/button-multi-demo.module';
import { ButtonRoundDemoModule } from './pages/button-round-demo/button-round-demo.module';
import { CalendarDemoModule } from './pages/calendar-demo/calendar-demo.module';
import { CardDemoModule } from './pages/card-demo/card-demo.module';
import { CheckboxDemoModule } from './pages/checkbox-demo/checkbox-demo.module';
import { CodeDemoModule } from './pages/code-demo/code-demo.module';
import { ColorsDemoModule } from './pages/colors-demo/colors-demo.module';
import { CounterDemoModule } from './pages/counter-demo/counter-demo.module';
import { DateTimePickerDemoModule } from './pages/date-time-picker-demo/date-time-picker-demo.module';
import { DaySelectorDemoModule } from './pages/day-selector-demo/day-selector-demo.module';
import { DndDemoModule } from './pages/dnd-demo/dnd-demo.module';
import { DrawerDemoModule } from './pages/drawer-demo/drawer-demo.module';
import { DropdownDemoModule } from './pages/dropdown-demo/dropdown-demo.module';
import { DropdownMenuDemoModule } from './pages/dropdown-menu-demo/dropdown-menu-demo.module';
import { FloatingCardDemoModule } from './pages/floating-card-demo/floating-card-demo.module';
import { IconDemoModule } from './pages/icon-demo/icon-demo.module';
import { IconHolderDemoModule } from './pages/icon-holder-demo/icon-holder-demo.module';
import { IconsPageModule } from './pages/icons-page/icons-page.module';
import { InfinityScrollerDemoModule } from './pages/infinity-scroller-demo/infinity-scroller-demo.module';
import { CalloutDemoModule } from './pages/callout-demo/callout-demo.module';
import { InputDemoModule } from './pages/input-demo/input-demo.module';
import { LabelDemoModule } from './pages/label-demo/label-demo.module';
import { LayoutDemoModule } from './pages/layout-demo/layout-demo.module';
import { LoaderDemoModule } from './pages/loader-demo/loader-demo.module';
import { MainPageModule } from './pages/main-page/main-page.module';
import { ModalDemoModule } from './pages/modal-demo/modal-demo.module';
import { NotFoundPageModule } from './pages/not-found-page/not-found-page.module';
import { OptionDemoModule } from './pages/option-demo/option-demo.module';
import { PagedVirtualScrollDemoModule } from './pages/paged-virtual-scroll-demo/paged-virtual-scroll-demo.module';
import { RadioButtonDemoModule } from './pages/radio-button-demo/radio-button-demo.module';
import { RatingDemoModule } from './pages/rating-demo/rating-demo.module';
import { RequiredFieldDemoModule } from './pages/required-field-demo/required-field-demo.module';
import { ScrollableDemoModule } from './pages/scrollable-demo/scrollable-demo.module';
import { ScrollbarDemoModule } from './pages/scrollbar-demo/scrollbar-demo.module';
import { SearchFieldDemoModule } from './pages/search-field-demo/search-field-demo.module';
import { SectionDemoModule } from './pages/section-demo/section-demo.module';
import { SelectDemoModule } from './pages/select-demo/select-demo.module';
import { SpinnerDemoModule } from './pages/spinner-demo/spinner-demo.module';
import { StatusDemoModule } from './pages/status-demo/status-demo.module';
import { StepperDemoModule } from './pages/stepper-demo/stepper-demo.module';
import { SwitcherDemoModule } from './pages/switcher-demo/switcher-demo.module';
import { TableDemoModule } from './pages/table-demo/table-demo.module';
import { TabsDemoModule } from './pages/tabs-demo/tabs-demo.module';
import { TagDemoModule } from './pages/tag-demo/tag-demo.module';
import { TextareaDemoModule } from './pages/textarea-demo/textarea-demo.module';
import { TooltipDemoModule } from './pages/tooltip-demo/tooltip-demo.module';
import { TreeNewDemoModule } from './pages/tree-new-demo/tree-new-demo.module';
import { TreeNodeDemoModule } from './pages/tree-node-demo/tree-node-demo.module';
import { TypographyPageModule } from './pages/typography-page/typography-page.module';
import { HighlightDemoModule } from './pages/highlight-demo/highlight-demo.module';
import { HotkeyDemoModule } from './pages/hotkey-demo/hotkey-demo.module';

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
        path: 'accordion',
        loadChildren: (): Promise<Type<AccordionDemoModule>> =>
          import('./pages/accordion-demo/accordion-demo.module').then((module: any) => module.AccordionDemoModule),
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
        path: 'icons',
        loadChildren: (): Promise<Type<IconsPageModule>> =>
          import('./pages/icons-page/icons-page.module').then((module: any) => module.IconsPageModule),
      },
      {
        path: 'icon',
        loadChildren: (): Promise<Type<IconDemoModule>> =>
          import('./pages/icon-demo/icon-demo.module').then((module: any) => module.IconDemoModule),
      },
      {
        path: 'icon-holder',
        loadChildren: (): Promise<Type<IconHolderDemoModule>> =>
          import('./pages/icon-holder-demo/icon-holder-demo.module').then((module: any) => module.IconHolderDemoModule),
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
        path: 'button-icon',
        loadChildren: (): Promise<Type<ButtonIconDemoModule>> =>
          import('./pages/button-icon-demo/button-icon-demo.module').then((module: any) => module.ButtonIconDemoModule),
      },
      {
        path: 'button-multi',
        loadChildren: (): Promise<Type<ButtonMultiDemoModule>> =>
          import('./pages/button-multi-demo/button-multi-demo.module').then(
            (module: any) => module.ButtonMultiDemoModule
          ),
      },
      {
        path: 'button-round',
        loadChildren: (): Promise<Type<ButtonRoundDemoModule>> =>
          import('./pages/button-round-demo/button-round-demo.module').then(
            (module: any) => module.ButtonRoundDemoModule
          ),
      },
      {
        path: 'card',
        loadChildren: (): Promise<Type<CardDemoModule>> =>
          import('./pages/card-demo/card-demo.module').then((module: any) => module.CardDemoModule),
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
        path: 'required-field',
        loadChildren: (): Promise<Type<RequiredFieldDemoModule>> =>
          import('./pages/required-field-demo/required-field-demo.module').then(
            (module: any) => module.RequiredFieldDemoModule
          ),
      },
      {
        path: 'search-field',
        loadChildren: (): Promise<Type<SearchFieldDemoModule>> =>
          import('./pages/search-field-demo/search-field-demo.module').then(
            (module: any) => module.SearchFieldDemoModule
          ),
      },
      {
        path: 'tree-new',
        loadChildren: (): Promise<Type<TreeNewDemoModule>> =>
          import('./pages/tree-new-demo/tree-new-demo.module').then((module: any) => module.TreeNewDemoModule),
      },
      {
        path: 'section',
        loadChildren: (): Promise<Type<SectionDemoModule>> =>
          import('./pages/section-demo/section-demo.module').then((module: any) => module.SectionDemoModule),
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
        path: 'dropdown',
        loadChildren: (): Promise<Type<DropdownDemoModule>> =>
          import('./pages/dropdown-demo/dropdown-demo.module').then((module: any) => module.DropdownDemoModule),
      },
      {
        path: 'rating',
        loadChildren: (): Promise<Type<RatingDemoModule>> =>
          import('./pages/rating-demo/rating-demo.module').then((module: any) => module.RatingDemoModule),
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
        path: 'dropdown-menu',
        loadChildren: (): Promise<Type<DropdownMenuDemoModule>> =>
          import('./pages/dropdown-menu-demo/dropdown-menu-demo.module').then(
            (module: any) => module.DropdownMenuDemoModule
          ),
      },
      {
        path: 'day-selector',
        loadChildren: (): Promise<Type<DaySelectorDemoModule>> =>
          import('./pages/day-selector-demo/day-selector-demo.module').then(
            (module: any) => module.DaySelectorDemoModule
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
        path: 'callout',
        loadChildren: (): Promise<Type<CalloutDemoModule>> =>
          import('./pages/callout-demo/callout-demo.module').then((module: any) => module.CalloutDemoModule),
      },
      {
        path: 'status',
        loadChildren: (): Promise<Type<StatusDemoModule>> =>
          import('./pages/status-demo/status-demo.module').then((module: any) => module.StatusDemoModule),
      },
      {
        path: 'infinity-scroller',
        loadChildren: (): Promise<Type<InfinityScrollerDemoModule>> =>
          import('./pages/infinity-scroller-demo/infinity-scroller-demo.module').then(
            (module: any) => module.InfinityScrollerDemoModule
          ),
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
        path: 'resizer',
        loadChildren: () =>
          import('./pages/resizer-demo/resizer-demo.module').then((module: any) => module.ResizerDemoModule),
      },
      {
        path: 'counter',
        loadChildren: (): Promise<Type<CounterDemoModule>> =>
          import('./pages/counter-demo/counter-demo.module').then((module: any) => module.CounterDemoModule),
      },
      {
        path: 'popover',
        loadChildren: () =>
          import('./pages/popover-demo/popover-demo.module').then((module: any) => module.PopoverDemoModule),
      },
      {
        path: 'form-layout',
        loadChildren: () =>
          import('./pages/form-layout-demo/form-layout-demo.module').then((module: any) => module.FormLayoutDemoModule),
      },
      {
        path: 'tree-node',
        loadChildren: (): Promise<Type<TreeNodeDemoModule>> =>
          import('./pages/tree-node-demo/tree-node-demo.module').then((module: any) => module.TreeNodeDemoModule),
      },
      {
        path: 'option',
        loadChildren: (): Promise<Type<OptionDemoModule>> =>
          import('./pages/option-demo/option-demo.module').then((module: any) => module.OptionDemoModule),
      },
      {
        path: 'dnd',
        loadChildren: (): Promise<Type<DndDemoModule>> =>
          import('./pages/dnd-demo/dnd-demo.module').then((module: any) => module.DndDemoModule),
      },
      {
        path: 'calendar',
        loadChildren: (): Promise<Type<CalendarDemoModule>> =>
          import('./pages/calendar-demo/calendar-demo.module').then((module: any) => module.CalendarDemoModule),
      },
      {
        path: 'highlight',
        loadChildren: (): Promise<Type<HighlightDemoModule>> =>
          import('./pages/highlight-demo/highlight-demo.module').then((module: any) => module.HighlightDemoModule),
      },
      {
        path: 'hotkey',
        loadChildren: (): Promise<Type<HotkeyDemoModule>> =>
          import('./pages/hotkey-demo/hotkey-demo.module').then((module: any) => module.HotkeyDemoModule),
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
      useHash: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

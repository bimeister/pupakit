import { NgModule } from '@angular/core';
import { HammerModule } from '@angular/platform-browser';
import { SharedModule } from '../internal/shared/shared.module';
import { AccordionModule } from './components/accordion/accordion.module';
import { ActionsModule } from './components/actions/actions.module';
import { AvatarModule } from './components/avatar/avatar.module';
import { BadgeModule } from './components/badge/badge.module';
import { BreadcrumbsModule } from './components/breadcrumbs/breadcrumbs.module';
import { ButtonGroupModule } from './components/button-group/button-group.module';
import { ButtonModule } from './components/button/button.module';
import { CardModule } from './components/card/card.module';
import { CheckboxModule } from './components/checkbox/checkbox.module';
import { ControlTextModule } from './components/control-text/control-text.module';
import { CounterModule } from './components/counter/counter.module';
import { DateTimePickerModule } from './components/date-time-picker/date-time-picker.module';
import { DaySelectorModule } from './components/day-selector/day-selector.module';
import { DndCloneContainerModule } from './components/dnd-clone-container/dnd-clone-container.module';
import { DrawerModule } from './components/drawer/drawer.module';
import { DropdownMenuModule } from './components/dropdown-menu/dropdown-menu.module';
import { DropdownModule } from './components/dropdown/dropdown.module';
import { DroppableModule } from './components/droppable/droppable.module';
import { FloatingCardModule } from './components/floating-card/floating-card.module';
import { FormLayoutModule } from './components/form-layout/form-layout.module';
import { InputModule } from './components/input/input.module';
import { LabelModule } from './components/label/label.module';
import { LayoutModule } from './components/layout/layout.module';
import { LinkModule } from './components/link/link.module';
import { ModalModule } from './components/modal/modal.module';
import { PagedVirtualScrollModule } from './components/paged-virtual-scroll/paged-virtual-scroll.module';
import { PopoverModule } from './components/popover/popover.module';
import { ProgressBarModule } from './components/progress-bar/progress-bar.module';
import { RadioGroupModule } from './components/radio-group/radio-group.module';
import { RatingModule } from './components/rating/rating.module';
import { ScrollableModule } from './components/scrollable/scrollable.module';
import { SearchFieldModule } from './components/search-field/search-field.module';
import { SelectModule } from './components/select/select.module';
import { SkeletonModule } from './components/skeleton/skeleton.module';
import { SpinnerModule } from './components/spinner/spinner.module';
import { StatusModule } from './components/status/status.module';
import { StepperModule } from './components/stepper/stepper.module';
import { SwitcherModule } from './components/switcher/switcher.module';
import { TableModule } from './components/table/table.module';
import { TabsModule } from './components/tabs/tabs.module';
import { TagModule } from './components/tag/tag.module';
import { TextareaModule } from './components/textarea/textarea.module';
import { ThemeWrapperModule } from './components/theme-wrapper/theme-wrapper.module';
import { TimerModule } from './components/timer/timer.module';
import { ToastModule } from './components/toast/toast.module';
import { TooltipModule } from './components/tooltip/tooltip.module';
import { TreeLayoutModule } from './components/tree-layout/tree-layout.module';
import { TreeNewModule } from './components/tree-new/tree-new.module';
import { IconHolderModule } from './components/icon-holder/icon-holder.module';

const EXPORTS: any[] = [
  AccordionModule,
  LabelModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  ControlTextModule,
  DateTimePickerModule,
  DrawerModule,
  DroppableModule,
  InputModule,
  LayoutModule,
  ModalModule,
  RadioGroupModule,
  RatingModule,
  SearchFieldModule,
  SpinnerModule,
  SwitcherModule,
  TabsModule,
  TextareaModule,
  ThemeWrapperModule,
  TooltipModule,
  DropdownMenuModule,
  TreeNewModule,
  SkeletonModule,
  SelectModule,
  ProgressBarModule,
  CounterModule,
  AvatarModule,
  PagedVirtualScrollModule,
  TableModule,
  FloatingCardModule,
  TagModule,
  ScrollableModule,
  StatusModule,
  BadgeModule,
  BreadcrumbsModule,
  ButtonGroupModule,
  ToastModule,
  LinkModule,
  TimerModule,
  StepperModule,
  ActionsModule,
  PopoverModule,
  DropdownModule,
  DndCloneContainerModule,
  DaySelectorModule,
  FormLayoutModule,
  TreeLayoutModule,
  IconHolderModule,
];

@NgModule({
  imports: [SharedModule, HammerModule, ...EXPORTS],
  exports: [...EXPORTS],
})
export class ComponentsModule {}

import { NgModule, Type } from '@angular/core';
import { PupaAccordionModule } from './components/accordion/accordion.module';
import { PupaAvatarModule } from './components/avatar/avatar.module';
import { PupaBadgeModule } from './components/badge/badge.module';
import { PupaBreadcrumbsModule } from './components/breadcrumbs/breadcrumbs.module';
import { PupaButtonGroupModule } from './components/button-group/button-group.module';
import { PupaButtonsModule } from './components/buttons/buttons.module';
import { PupaCardModule } from './components/card/card.module';
import { PupaCheckboxModule } from './components/checkbox/checkbox.module';
import { PupaCounterModule } from './components/counter/counter.module';
import { PupaDropdownMenuModule } from './components/dropdown-menu/dropdown-menu.module';
import { PupaDropdownModule } from './components/dropdown/dropdown.module';
import { PupaIconHolderModule } from './components/icon-holder/icon-holder.module';
import { PupaLayoutModule } from './components/layout/layout.module';
import { PupaLinkModule } from './components/link/link.module';
import { PupaLoaderModule } from './components/loader/loader.module';
import { PupaOptionModule } from './components/option/option.module';
import { PupaProgressBarModule } from './components/progress-bar/progress-bar.module';
import { PupaScrollableModule } from './components/scrollable/scrollable.module';
import { PupaSectionModule } from './components/section/section.module';
import { PupaSkeletonModule } from './components/skeleton/skeleton.module';
import { PupaStatusModule } from './components/status/status.module';
import { PupaStepperModule } from './components/stepper/stepper.module';
import { PupaTabsModule } from './components/tabs/tabs.module';
import { PupaTagModule } from './components/tag/tag.module';
import { PupaThemeWrapperModule } from './components/theme-wrapper/theme-wrapper.module';
import { PupaTimerModule } from './components/timer/timer.module';
import { PupaTooltipModule } from './components/tooltip/tooltip.module';
import { PupaCalloutModule } from './components/callout/callout.module';
import { ResizableModule } from './components/resizable/resizable.module';
import { PupaHotkeyModule } from './components/hotkey/hotkey.module';

const MODULES: Type<unknown>[] = [
  PupaSkeletonModule,
  PupaScrollableModule,
  PupaTagModule,
  PupaDropdownModule,
  PupaTooltipModule,
  PupaButtonsModule,
  PupaCheckboxModule,
  PupaOptionModule,
  PupaTimerModule,
  PupaLinkModule,
  PupaLoaderModule,
  PupaDropdownMenuModule,
  PupaAccordionModule,
  PupaAvatarModule,
  PupaBadgeModule,
  PupaBreadcrumbsModule,
  PupaButtonGroupModule,
  PupaCardModule,
  PupaCounterModule,
  PupaIconHolderModule,
  PupaLayoutModule,
  PupaProgressBarModule,
  PupaSectionModule,
  PupaStatusModule,
  PupaTabsModule,
  PupaStepperModule,
  PupaThemeWrapperModule,
  PupaCalloutModule,
  ResizableModule,
  PupaHotkeyModule,
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class PupaKitModule {}

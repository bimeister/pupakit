import { NgModule } from '@angular/core';

import { TooltipContentComponent } from './components/tooltip-content/tooltip-content.component';
import { TooltipTriggerComponent } from './components/tooltip-trigger/tooltip-trigger.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { SharedModule } from '../../../internal/shared/shared.module';

@NgModule({
  declarations: [TooltipTriggerComponent, TooltipContentComponent, TooltipComponent],
  imports: [SharedModule, OverlayModule],
  exports: [TooltipTriggerComponent, TooltipContentComponent, TooltipComponent]
})
export class TooltipModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TooltipContentComponent } from './components/tooltip-content/tooltip-content.component';
import { TooltipTriggerComponent } from './components/tooltip-trigger/tooltip-trigger.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';

@NgModule({
  declarations: [TooltipTriggerComponent, TooltipContentComponent, TooltipComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TooltipTriggerComponent, TooltipContentComponent, TooltipComponent]
})
export class TooltipModule {}

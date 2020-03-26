import { Component, ElementRef, Host } from '@angular/core';

import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'pupa-tooltip-trigger',
  templateUrl: './tooltip-trigger.component.html',
  styleUrls: ['./tooltip-trigger.component.scss']
})
export class TooltipTriggerComponent {
  constructor(@Host() private readonly tooltip: TooltipComponent, private readonly hostRef: ElementRef<HTMLElement>) {
    this.tooltip.triggerRef = this.hostRef;
  }
}

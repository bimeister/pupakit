import { AfterViewInit, Component, Host, TemplateRef, ViewChild } from '@angular/core';

import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  selector: 'pupa-tooltip-content',
  templateUrl: './tooltip-content.component.html'
})
export class TooltipContentComponent implements AfterViewInit {
  @ViewChild('content') public contentRef: TemplateRef<HTMLElement>;

  constructor(@Host() private readonly tooltip: TooltipComponent) {}

  public ngAfterViewInit(): void {
    this.tooltip.contentRef = this.contentRef;
  }
}

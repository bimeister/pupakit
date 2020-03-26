import { Component, ElementRef, HostListener, Input, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { TooltipService } from '../../../layout/services/tooltip.service';

@Component({
  selector: 'pupa-tooltip',
  templateUrl: './tooltip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {
  @Input() public closeOnContentClick: boolean = true;

  public triggerRef: ElementRef<HTMLElement>;
  public contentRef: TemplateRef<HTMLElement>;

  constructor(private readonly tooltipService: TooltipService) {}

  public open(): void {
    this.tooltipService.open({
      triggerRef: this.triggerRef,
      templateRef: this.contentRef,
      closeOnContentClick: this.closeOnContentClick
    });
  }

  @HostListener('click')
  @HostListener('mouseenter')
  public clickOpen(): void {
    this.open();
  }
}

import { ElementRef, TemplateRef } from '@angular/core';

export interface TooltipConfig {
  triggerRef: ElementRef<HTMLElement>;
  templateRef: TemplateRef<HTMLElement>;
  closeOnContentClick: boolean;
}

export type TooltipBubbleDirection = 'top' | 'right' | 'left' | 'bottom';

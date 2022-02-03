import { ElementRef, TemplateRef } from '@angular/core';

export interface DroppableConfig {
  triggerRef: ElementRef<HTMLElement>;
  templateRef: TemplateRef<HTMLElement>;
  closeOnContentClick: boolean;
}

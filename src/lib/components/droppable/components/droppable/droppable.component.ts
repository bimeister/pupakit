import { Component, ElementRef, HostListener, Input, TemplateRef } from '@angular/core';

import { DroppableService } from '../../../layout/services/droppable.service';

@Component({
  selector: 'pupa-droppable',
  templateUrl: './droppable.component.html'
})
export class DroppableComponent {
  @Input() public closeOnContentClick: boolean = true;
  public triggerRef: ElementRef<HTMLElement>;
  public contentRef: TemplateRef<HTMLElement>;

  constructor(private readonly droppableService: DroppableService) {}

  @HostListener('click')
  public open(): void {
    this.droppableService.open({
      triggerRef: this.triggerRef,
      templateRef: this.contentRef,
      closeOnContentClick: this.closeOnContentClick
    });
  }
}

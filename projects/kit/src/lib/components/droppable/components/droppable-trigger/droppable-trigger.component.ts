import { Component, ElementRef, Host } from '@angular/core';

import { DroppableComponent } from '../droppable/droppable.component';

@Component({
  selector: 'pupa-droppable-trigger',
  templateUrl: './droppable-trigger.component.html',
  styleUrls: ['./droppable-trigger.component.scss'],
})
export class DroppableTriggerComponent {
  constructor(
    @Host() private readonly droppable: DroppableComponent,
    private readonly hostRef: ElementRef<HTMLElement>
  ) {
    this.droppable.triggerRef = this.hostRef;
  }
}

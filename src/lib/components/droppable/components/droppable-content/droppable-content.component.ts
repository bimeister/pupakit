import { AfterViewInit, Component, Host, TemplateRef, ViewChild } from '@angular/core';

import { DroppableComponent } from '../droppable/droppable.component';

@Component({
  selector: 'pupa-droppable-content',
  templateUrl: './droppable-content.component.html'
})
export class DroppableContentComponent implements AfterViewInit {
  @ViewChild('content') public contentRef: TemplateRef<HTMLElement>;

  constructor(@Host() private readonly droppable: DroppableComponent) {}

  public ngAfterViewInit(): void {
    this.droppable.contentRef = this.contentRef;
  }
}

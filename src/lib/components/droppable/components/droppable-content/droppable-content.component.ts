import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Host, ViewEncapsulation } from '@angular/core';

import { DroppableContent } from '../../../../../internal/declarations/classes/droppable-content.class';
import { DroppableWidth } from '../../../../../internal/declarations/types/droppable-width.type';
import { DroppableComponent } from '../droppable/droppable.component';

@Component({
  selector: 'pupa-droppable-content',
  styleUrls: ['./droppable-content.component.scss'],
  templateUrl: './droppable-content.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      state('open', style({ transform: 'translateY(0)', opacity: 1 })),
      state('closed', style({ transform: 'translateY(-10px)', opacity: 0 })),
      transition('closed => open', [animate('150ms')])
    ])
  ]
})
export class DroppableContentComponent extends DroppableContent {
  public get widthType(): DroppableWidth {
    return this.droppableComponent.widthType;
  }

  public get widthClassName(): string {
    return `width-${this.widthType}`;
  }

  public get triggerWidtxPx(): number {
    return this.droppableComponent.triggerRef.nativeElement.getBoundingClientRect().width;
  }

  constructor(@Host() protected readonly droppableComponent: DroppableComponent) {
    super(droppableComponent);
  }
}

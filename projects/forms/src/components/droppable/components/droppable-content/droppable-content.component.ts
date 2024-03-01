import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { DroppableContent } from '../../declarations/classes/abstract/droppable-content.abstract';
import { DroppableWidth } from '../../declarations/types/droppable-width.type';

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
      transition('closed => open', [animate('150ms')]),
    ]),
  ],
})
export class DroppableContentComponent extends DroppableContent {
  public get widthType(): DroppableWidth {
    return this.droppable.widthType;
  }

  public get widthClassName(): string {
    return `pupa-width-${this.widthType}`;
  }

  public get triggerWidthPx(): number {
    return this.droppable.triggerRef.nativeElement.getBoundingClientRect().width;
  }
}

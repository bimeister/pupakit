import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';

import { MODAL_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/modal-container-data.token';
import { ModalContainerData } from '../../../../../internal/declarations/interfaces/modal-container-data.interface';

const ANIMATION: string = `400ms cubic-bezier(0.25, 0.8, 0.25, 1)`;

@Component({
  selector: 'pupa-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalExpanded', [
      state('void', style({ transform: 'scale(0.7)', opacity: 0 })),
      state('enter', style({ transform: 'scale(1)', opacity: 1 })),
      transition('* => *', animate(ANIMATION))
    ])
  ]
})
export class ModalContainerComponent<componentT> {
  public animationState: 'void' | 'enter' | 'leave' = 'enter';

  public get componentPortal(): ComponentPortal<componentT> {
    return this.componentData.contentComponentPortal;
  }

  constructor(@Inject(MODAL_CONTAINER_DATA_TOKEN) private readonly componentData: ModalContainerData<componentT>) {}
}

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';

import { DRAWER_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/drawer-container-data.token';
import { DrawerContainerData } from '../../../../../internal/declarations/interfaces/drawer-container-data.interface';

const ANIMATION: string = `400ms cubic-bezier(0.25, 0.8, 0.25, 1)`;

@Component({
  selector: 'pupa-drawer-container',
  templateUrl: './drawer-container.component.html',
  styleUrls: ['./drawer-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('drawerLeftExpanded', [
      state('void', style({ left: '-100%', opacity: 0 })),
      state('enter', style({ left: '0', opacity: 1 })),
      transition('* => *', animate(ANIMATION))
    ]),
    trigger('drawerRightExpanded', [
      state('void', style({ right: '-100%', opacity: 0 })),
      state('enter', style({ right: '0', opacity: 1 })),
      transition('* => *', animate(ANIMATION))
    ])
  ]
})
export class DrawerContainerComponent<componentT> {
  public animationState: 'void' | 'enter' | 'leave' = 'enter';

  public get float(): 'left' | 'right' {
    return this.componentData.float;
  }

  public get componentPortal(): ComponentPortal<componentT> {
    return this.componentData.contentComponentPortal;
  }

  constructor(@Inject(DRAWER_CONTAINER_DATA_TOKEN) private readonly componentData: DrawerContainerData<componentT>) {}
}

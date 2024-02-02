import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { POPOVER_CONTAINER_DATA_TOKEN } from '../../../../declarations/tokens/popover-container-data.token';
import { PopoverContainerData } from '../../../../declarations/interfaces/popover-container-data.interface';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';

type PopoverAnimationState = 'void' | 'showDesktop' | 'showMobile';

const ANIMATION: string = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'pupa-popover-container',
  templateUrl: './popover-container.component.html',
  styleUrls: ['./popover-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('popoverShow', [
      transition('void => showDesktop', [
        animate(
          ANIMATION,
          keyframes([
            style({ transform: 'translateY(10px)', opacity: 0 }),
            style({ transform: 'translateY(0px)', opacity: 1 }),
          ])
        ),
      ]),
      transition('void => showMobile', [
        animate(
          ANIMATION,
          keyframes([
            style({ transform: 'translate(0, 100%)', opacity: 0 }),
            style({ transform: 'translate(0, 0)', opacity: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class PopoverContainerComponent {
  public readonly componentPortal: ComponentPortal<unknown> = this.componentData.componentPortal;

  public readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  public readonly animationState$: BehaviorSubject<PopoverAnimationState> = new BehaviorSubject<PopoverAnimationState>(
    'void'
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(POPOVER_CONTAINER_DATA_TOKEN) private readonly componentData: PopoverContainerData,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService
  ) {
    this.subscription.add(this.onBreakpointChange());
  }

  public stopEvent(event: Event): void {
    event.stopPropagation();
  }

  private onBreakpointChange(): Subscription {
    return this.clientUiStateHandlerService.breakpointIsXs$.subscribe((isMobile: boolean) =>
      isMobile ? this.animationState$.next('showMobile') : this.animationState$.next('showDesktop')
    );
  }
}

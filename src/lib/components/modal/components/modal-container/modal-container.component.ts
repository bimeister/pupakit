import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MODAL_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/modal-container-data.token';
import { ModalContainerData } from '../../../../../internal/declarations/interfaces/modal-container-data.interface';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';

const ANIMATION: string = `400ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
type ANIMATION_STATE = 'void' | 'enter' | 'leave' | 'enterMobile';

@Component({
  selector: 'pupa-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('modalExpanded', [
      transition('void => enter', [
        animate(
          ANIMATION,
          keyframes([style({ transform: 'scale(0.7)', opacity: 0 }), style({ transform: 'scale(1)', opacity: 1 })])
        )
      ]),
      transition('void => enterMobile', [
        animate(
          ANIMATION,
          keyframes([
            style({ transform: 'translate(0, 200%)', opacity: 0 }),
            style({ transform: 'translate(0, 0)', opacity: 1 })
          ])
        )
      ])
    ])
  ]
})
export class ModalContainerComponent<componentT> implements OnDestroy {
  public animationState$: BehaviorSubject<ANIMATION_STATE> = new BehaviorSubject('void');

  public isBackdropColorful$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();

  public get componentPortal(): ComponentPortal<componentT> {
    return this.componentData.contentComponentPortal;
  }

  constructor(
    @Inject(MODAL_CONTAINER_DATA_TOKEN) private readonly componentData: ModalContainerData<componentT>,
    private readonly overlayRef: OverlayRef,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService
  ) {
    this.subscription.add(this.handleBackdropAttached());
    this.subscription.add(this.handleBreakpoint());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleBackdropAttached(): Subscription {
    return this.overlayRef.attachments().subscribe(() => {
      this.isBackdropColorful$.next(
        this.overlayRef.backdropElement &&
          this.overlayRef.backdropElement.classList.contains('cdk-overlay-dark-backdrop')
      );
    });
  }

  private handleBreakpoint(): Subscription {
    return this.clientUiStateHandlerService.breakpoint$
      .pipe(
        map((breakpoint: string) => breakpoint === 'xs'),
        distinctUntilChanged()
      )
      .subscribe((isMobileBreakpoint: boolean) => {
        const animationState: ANIMATION_STATE = isMobileBreakpoint ? 'enterMobile' : 'enter';
        this.animationState$.next(animationState);
      });
  }
}

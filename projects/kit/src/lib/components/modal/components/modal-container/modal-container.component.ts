import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MODAL_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/modal-container-data.token';
import { ModalRef } from '../../../../../internal/declarations/classes/modal-ref.class';
import { ModalContainerData } from '../../../../../internal/declarations/interfaces/modal-container-data.interface';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';

const ANIMATION: string = `400ms cubic-bezier(0.25, 0.8, 0.25, 1)`;
type AnimationState = 'void' | 'enter' | 'leave' | 'enterMobile';

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
        ),
      ]),
      transition('void => enterMobile', [
        animate(
          ANIMATION,
          keyframes([
            style({ transform: 'translate(0, 200%)', opacity: 0 }),
            style({ transform: 'translate(0, 0)', opacity: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class ModalContainerComponent<ComponentT> implements OnDestroy {
  @ViewChild(CdkPortalOutlet) public сdkPortalOutlet: CdkPortalOutlet;

  public readonly animationState$: BehaviorSubject<AnimationState> = new BehaviorSubject('void');

  public readonly isFullscreen$: Observable<boolean> = this.modalRef.isFullscreen$;

  public get componentPortal(): ComponentPortal<ComponentT> {
    return this.componentData.contentComponentPortal;
  }
  private readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(MODAL_CONTAINER_DATA_TOKEN) private readonly componentData: ModalContainerData<ComponentT>,
    private readonly modalRef: ModalRef,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService
  ) {
    this.subscription.add(this.processAnimationStateByBreakpoint());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processAnimationStateByBreakpoint(): Subscription {
    return this.clientUiStateHandlerService.breakpoint$
      .pipe(
        map((breakpoint: string) => breakpoint === 'xs'),
        distinctUntilChanged()
      )
      .subscribe((isMobileBreakpoint: boolean) => {
        const animationState: AnimationState = isMobileBreakpoint ? 'enterMobile' : 'enter';
        this.animationState$.next(animationState);
      });
  }
}

import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationMetadata,
  AnimationPlayer,
  style,
} from '@angular/animations';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  Inject,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DRAWER_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/drawer-container-data.token';
import { DrawerRef } from '../../../../../internal/declarations/classes/drawer-ref.class';
import { DrawerContainerData } from '../../../../../internal/declarations/interfaces/drawer-container-data.interface';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';

const ANIMATION: string = `400ms cubic-bezier(0.25, 0.8, 0.25, 1)`;

type Floats = 'bottom' | 'left' | 'right';

const animations: { [key in Floats]: AnimationMetadata[] } = {
  left: [style({ left: '-100%', opacity: 0 }), animate(ANIMATION, style({ left: '0', bottom: '0', opacity: 1 }))],
  right: [style({ right: '-100%', opacity: 0 }), animate(ANIMATION, style({ right: '0', bottom: '0', opacity: 1 }))],
  bottom: [style({ bottom: '-100%', opacity: 0 }), animate(ANIMATION, style({ bottom: '0', right: '0', opacity: 1 }))],
};

@Component({
  selector: 'pupa-drawer-container',
  templateUrl: './drawer-container.component.html',
  styleUrls: ['./drawer-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerContainerComponent<ComponentT> implements AfterViewInit, OnDestroy {
  @ViewChild('drawerContainer', { read: ElementRef }) public drawerContainerElement: ElementRef;

  @ViewChild(CdkPortalOutlet) public сdkPortalOutlet: CdkPortalOutlet;

  private readonly drawerContainerElement$: Subject<ElementRef> = new Subject<ElementRef>();

  private readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  private readonly float$: Observable<Floats> = this.isMobile$.pipe(
    map((isMobile: boolean) => (isMobile ? 'bottom' : this.componentData.float))
  );
  public readonly isFullscreen$: Observable<boolean> = this.drawerRef.isFullscreen$;

  public readonly floatStyles$: Observable<Nullable<Record<string, number>>> = combineLatest([
    this.float$.pipe(take(1)),
    this.isFullscreen$.pipe(take(1)),
  ]).pipe(
    map(([float, isFullscreen]: [Floats, boolean]) => {
      if (!isFullscreen) {
        return null;
      }

      return { [float]: 0 };
    })
  );

  public get componentPortal(): ComponentPortal<ComponentT> {
    return this.componentData.contentComponentPortal;
  }

  public get hasPadding(): boolean {
    const { hasPadding = true }: DrawerContainerData<ComponentT> = this.componentData;
    return hasPadding;
  }

  private readonly animationPlayer$: Observable<AnimationPlayer> = combineLatest([
    this.float$,
    this.drawerContainerElement$.pipe(filterNotNil()),
  ]).pipe(
    map(([float, elementRef]: [Floats, ElementRef]) => {
      const animationFactory: AnimationFactory = this.animationBuilder.build(animations[float]);
      const animationPlayer: AnimationPlayer = animationFactory.create(elementRef.nativeElement);
      return animationPlayer;
    })
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(DRAWER_CONTAINER_DATA_TOKEN) private readonly componentData: DrawerContainerData<ComponentT>,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly animationBuilder: AnimationBuilder,
    private readonly drawerRef: DrawerRef,
    private readonly renderer: Renderer2
  ) {
    this.playAnimation();
  }

  public ngAfterViewInit(): void {
    if (!isNil(this.drawerContainerElement)) {
      this.drawerContainerElement$.next(this.drawerContainerElement);
    }

    this.subscription.add(this.handleComponentOutletWidth());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleComponentOutletWidth(): Subscription {
    return combineLatest([this.drawerRef.isFullscreen$, this.isMobile$])
      .pipe(map(([isFullscreen, isMobile]: [boolean, boolean]) => isFullscreen || isMobile))
      .subscribe((isFullscreenOrMobile: boolean) => {
        if (!(this.сdkPortalOutlet.attachedRef instanceof ComponentRef)) {
          return;
        }

        const drawerComponentOutlet: HTMLElement = this.сdkPortalOutlet.attachedRef.location.nativeElement;
        if (isFullscreenOrMobile) {
          this.renderer.setStyle(drawerComponentOutlet, 'width', 'inherit');
          return;
        }
        this.renderer.removeStyle(drawerComponentOutlet, 'width');
      });
  }

  private playAnimation(): void {
    combineLatest([this.animationPlayer$.pipe(take(1)), this.isFullscreen$.pipe(take(1))]).subscribe(
      ([player, isFullscreen]: [AnimationPlayer, boolean]) => {
        if (isFullscreen) {
          return;
        }
        player.play();
      }
    );
  }
}

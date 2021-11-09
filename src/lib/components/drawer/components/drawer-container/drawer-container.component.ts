import {
  animate,
  AnimationBuilder,
  AnimationFactory,
  AnimationMetadata,
  AnimationPlayer,
  style
} from '@angular/animations';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { DRAWER_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/drawer-container-data.token';
import { DrawerContainerData } from '../../../../../internal/declarations/interfaces/drawer-container-data.interface';
import { combineLatest, Observable, Subject } from 'rxjs';
import { ClientUiStateHandlerService } from '../../../../../internal/shared/services/client-ui-state-handler.service';
import { map, take } from 'rxjs/operators';
import { filterNotNil, isNil } from '@bimeister/utilities';

const ANIMATION: string = `400ms cubic-bezier(0.25, 0.8, 0.25, 1)`;

type Floats = 'bottom' | 'left' | 'right';

const animations: { [key in Floats]: AnimationMetadata[] } = {
  left: [style({ left: '-100%', opacity: 0 }), animate(ANIMATION, style({ left: '0', bottom: '0', opacity: 1 }))],
  right: [style({ right: '-100%', opacity: 0 }), animate(ANIMATION, style({ right: '0', bottom: '0', opacity: 1 }))],
  bottom: [style({ bottom: '-100%', opacity: 0 }), animate(ANIMATION, style({ bottom: '0', right: '0', opacity: 1 }))]
};

@Component({
  selector: 'pupa-drawer-container',
  templateUrl: './drawer-container.component.html',
  styleUrls: ['./drawer-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerContainerComponent<componentT> implements AfterViewInit {
  @ViewChild('drawerContainer', { read: ElementRef }) public drawerContainerElement: ElementRef;

  private readonly drawerContainerElement$: Subject<ElementRef> = new Subject<ElementRef>();

  private readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  private readonly float$: Observable<Floats> = this.isMobile$.pipe(
    map((isMobile: boolean) => (isMobile ? 'bottom' : this.componentData.float))
  );

  public get componentPortal(): ComponentPortal<componentT> {
    return this.componentData.contentComponentPortal;
  }

  public get hasPadding(): boolean {
    const { hasPadding = true }: DrawerContainerData<componentT> = this.componentData;
    return hasPadding;
  }

  private readonly animationPlayer$: Observable<AnimationPlayer> = combineLatest([
    this.float$,
    this.drawerContainerElement$.pipe(filterNotNil())
  ]).pipe(
    map(([float, elementRef]: [Floats, ElementRef]) => {
      const animationFactory: AnimationFactory = this.animationBuilder.build(animations[float]);
      const animationPlayer: AnimationPlayer = animationFactory.create(elementRef.nativeElement);
      return animationPlayer;
    })
  );

  constructor(
    @Inject(DRAWER_CONTAINER_DATA_TOKEN) private readonly componentData: DrawerContainerData<componentT>,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly animationBuilder: AnimationBuilder
  ) {
    this.playAnimation();
  }

  public ngAfterViewInit(): void {
    if (!isNil(this.drawerContainerElement)) {
      this.drawerContainerElement$.next(this.drawerContainerElement);
    }
  }

  private playAnimation(): void {
    this.animationPlayer$.pipe(take(1)).subscribe((player: AnimationPlayer) => {
      player.play();
    });
  }
}

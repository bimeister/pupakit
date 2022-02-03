import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastComponent } from '../../../lib/components/toast/components/toast/toast.component';
import { ToastContainerComponent } from '../../../public-api';
import { TOAST_CONTAINER_DATA_TOKEN } from '../../constants/tokens/toast-container-data.token';
import { ToastComponentBase } from '../../declarations/classes/abstract/toast-component-base.abstract';
import { OpenedToast } from '../../declarations/classes/opened-toast.class';
import { ToastRef } from '../../declarations/classes/toast-ref.class';
import { Theme } from '../../declarations/enums/theme.enum';
import { ToastConfig } from '../../declarations/interfaces/toast-config.interface';
import { ToastContainerData } from '../../declarations/interfaces/toast-container-data.interface';
import { ToastDataType } from '../../declarations/types/utility-types/toast-data.utility-type';
import { ToastReturnType } from '../../declarations/types/utility-types/toast-return.utility-type';
import { ClientUiStateHandlerService } from './client-ui-state-handler.service';

const BOTTOM_OFFSET_PX: number = 32;
const LEFT_OFFSET_PX: number = 24;

@Injectable({ providedIn: 'root' })
export class ToastsService {
  private toastRef: ToastRef<unknown, unknown> | null = null;

  private readonly theme$: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(Theme.Dark);

  constructor(
    private readonly overlay: Overlay,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService
  ) {}

  public setTheme(theme: Theme): void {
    this.theme$.next(theme);
  }

  public open<TComponent extends ToastComponentBase<unknown, unknown> = ToastComponent>(
    config: ToastConfig<TComponent, ToastDataType<TComponent>>
  ): OpenedToast<ToastReturnType<TComponent>> {
    const toastRef: ToastRef<ToastDataType<TComponent>, ToastReturnType<TComponent>> = new ToastRef<
      ToastDataType<TComponent>,
      ToastReturnType<TComponent>
    >(config);

    const containerPortal: ComponentPortal<ToastContainerComponent> = this.getContainerPortal(toastRef);

    const overlayRef: OverlayRef = this.getOverlayRef(toastRef);
    overlayRef.attach(containerPortal);

    if (!isNil(this.toastRef)) {
      this.toastRef.close();
    }
    this.toastRef = toastRef;

    toastRef.closed$.subscribe(() => {
      overlayRef.dispose();
    });

    return new OpenedToast(toastRef);
  }

  private getContainerPortal(toastRef: ToastRef<unknown, unknown>): ComponentPortal<ToastContainerComponent> {
    const injector: Injector = Injector.create({
      parent: toastRef.config.injector,
      providers: [{ provide: ToastRef, useValue: toastRef }],
    });

    const componentPortal: ComponentPortal<unknown> = new ComponentPortal<unknown>(
      toastRef.config.component ?? ToastComponent,
      null,
      injector
    );

    const containerData: ToastContainerData = {
      componentPortal,
      theme$: this.theme$,
    };

    return new ComponentPortal(
      ToastContainerComponent,
      null,
      Injector.create({
        providers: [{ provide: TOAST_CONTAINER_DATA_TOKEN, useValue: containerData }],
      })
    );
  }

  private getOverlayRef(toastRef: ToastRef<unknown, unknown>): OverlayRef {
    const startPosition: GlobalPositionStrategy = this.overlay
      .position()
      .global()
      .bottom(`${BOTTOM_OFFSET_PX}px`)
      .centerHorizontally();

    const overlayRef: OverlayRef = this.overlay.create({
      positionStrategy: startPosition.centerHorizontally(),
    });

    this.clientUiStateHandlerService.breakpointIsSm$
      .pipe(takeUntil(toastRef.closeTriggered$))
      .subscribe((breakpointIsSm: boolean) => {
        if (breakpointIsSm) {
          const newPosition: GlobalPositionStrategy = this.overlay
            .position()
            .global()
            .bottom(`${BOTTOM_OFFSET_PX}px`)
            .left(`${LEFT_OFFSET_PX}px`);
          overlayRef.updatePositionStrategy(newPosition);
          return;
        }
        const newPosition: GlobalPositionStrategy = this.overlay
          .position()
          .global()
          .bottom(`${BOTTOM_OFFSET_PX}px`)
          .centerHorizontally();
        overlayRef.updatePositionStrategy(newPosition);
      });

    this.clientUiStateHandlerService.breakpointIsXs$
      .pipe(takeUntil(toastRef.closeTriggered$))
      .subscribe((breakpointIsSm: boolean) => {
        if (breakpointIsSm) {
          overlayRef.updateSize({ width: '100%' });
          return;
        }
        overlayRef.updateSize({ width: 'auto' });
      });

    return overlayRef;
  }
}

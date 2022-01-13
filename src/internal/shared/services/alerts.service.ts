import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy } from '@angular/core';
import { isEmpty, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';

import { AlertComponent } from '../../../lib/components/alert/components/alert/alert.component';
import { AlertsContainerComponent } from '../../../lib/components/alert/components/alerts-container/alerts-container.component';
import { ALERTS_CONTAINER_DATA_TOKEN } from '../../constants/tokens/alerts-container-data.token';
import { AlertComponentBase } from '../../declarations/classes/abstract/alert-component-base.abstract';
import { AlertRef } from '../../declarations/classes/alert-ref.class';
import { OpenedAlert } from '../../declarations/classes/opened-alert.class';
import { Theme } from '../../declarations/enums/theme.enum';
import { AlertConfig } from '../../declarations/interfaces/alert-config.interface';
import { AlertsContainerData } from '../../declarations/interfaces/alerts-container-data.interface';
import { AlertDataType } from '../../declarations/types/utility-types/alert-data.utility-type';
import { AlertReturnType } from '../../declarations/types/utility-types/alert-return.utility-type';

@Injectable({ providedIn: 'root' })
export class AlertsService implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  private readonly componentsToRenderMap: Map<string, ComponentPortal<unknown>> = new Map<
    string,
    ComponentPortal<unknown>
  >();
  private readonly componentPortals$: BehaviorSubject<ComponentPortal<unknown>[]> = new BehaviorSubject<
    ComponentPortal<unknown>[]
  >([]);

  public readonly alertsCount$: Observable<number> = this.componentPortals$.pipe(
    map((componentsToRender: ComponentPortal<unknown>[]) => componentsToRender.length),
    shareReplayWithRefCount()
  );

  private readonly isAlertsContainerVisible$: Observable<boolean> = this.componentPortals$.pipe(
    map((componentsToRender: ComponentPortal<unknown>[]) => !isEmpty(componentsToRender)),
    distinctUntilChanged()
  );

  private readonly theme$: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(Theme.Dark);

  private overlayRef: OverlayRef | null = null;

  constructor(private readonly overlay: Overlay) {
    this.subscription.add(this.processIsAlertsContainerVisibleChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setTheme(theme: Theme): void {
    this.theme$.next(theme);
  }

  public open<TComponent extends AlertComponentBase<unknown, unknown> = AlertComponent>(
    config: AlertConfig<TComponent, AlertDataType<TComponent>>
  ): OpenedAlert<AlertReturnType<TComponent>> {
    const alertRef: AlertRef<AlertDataType<TComponent>, AlertReturnType<TComponent>> = new AlertRef<
      AlertDataType<TComponent>,
      AlertReturnType<TComponent>
    >(config);

    const injector: Injector = Injector.create({
      parent: config.injector,
      providers: [{ provide: AlertRef, useValue: alertRef }],
    });

    this.componentsToRenderMap.set(
      alertRef.id,
      new ComponentPortal<unknown>(config.component ?? AlertComponent, null, injector)
    );
    this.updateComponentsToRender();

    alertRef.closed$.subscribe(() => {
      this.componentsToRenderMap.delete(alertRef.id);
      this.updateComponentsToRender();
    });

    return new OpenedAlert(alertRef);
  }

  public closeAll(): void {
    this.componentPortals$.pipe(take(1)).subscribe((componentsToRender: ComponentPortal<unknown>[]) => {
      for (const portal of componentsToRender) {
        const alertRef: AlertRef = portal.injector.get(AlertRef);
        alertRef.close();
      }
    });
  }

  private updateComponentsToRender(): void {
    const componentsToRender: ComponentPortal<unknown>[] = Array.from(this.componentsToRenderMap.values()).reverse();
    this.componentPortals$.next(componentsToRender);
  }

  private processIsAlertsContainerVisibleChanges(): Subscription {
    return this.isAlertsContainerVisible$.subscribe((isVisible: boolean) => {
      if (!isVisible) {
        this.overlayRef?.dispose();
        return;
      }

      const alertsContainerData: AlertsContainerData = {
        componentPortals$: this.componentPortals$,
        theme$: this.theme$,
      };

      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global().right().top(),
      });

      const portal: ComponentPortal<AlertsContainerComponent> = new ComponentPortal(
        AlertsContainerComponent,
        null,
        Injector.create({
          providers: [{ provide: ALERTS_CONTAINER_DATA_TOKEN, useValue: alertsContainerData }],
        })
      );
      this.overlayRef.attach(portal);
    });
  }
}

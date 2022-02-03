import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, TrackByFunction, ViewEncapsulation } from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ALERT_MODULE_CONFIG_TOKEN } from '../../../../../internal/constants/tokens/alert-module-config.token';
import { ALERTS_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/alerts-container-data.token';
import { AlertRef } from '../../../../../internal/declarations/classes/alert-ref.class';
import { Theme } from '../../../../../internal/declarations/enums/theme.enum';
import { AlertModuleConfig } from '../../../../../internal/declarations/interfaces/alert-module-config.interface';
import { AlertsContainerData } from '../../../../../internal/declarations/interfaces/alerts-container-data.interface';

@Component({
  selector: 'pupa-alerts-container',
  templateUrl: './alerts-container.component.html',
  styleUrls: ['./alerts-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsContainerComponent {
  public readonly componentPortals$: Observable<ComponentPortal<unknown>[]> = this.data.componentPortals$;
  public readonly isToolbarVisible$: Observable<boolean> = this.data.componentPortals$.pipe(
    map((componentsToRender: ComponentPortal<unknown>[]) => componentsToRender.length > 2)
  );

  public readonly theme$: Observable<Theme> = this.data.theme$;

  public readonly toolbarComponentPortal: Nullable<ComponentPortal<unknown>> = isNil(
    this.alertModuleConfig.toolbarComponent
  )
    ? null
    : new ComponentPortal(this.alertModuleConfig.toolbarComponent);

  constructor(
    @Inject(ALERTS_CONTAINER_DATA_TOKEN) private readonly data: AlertsContainerData,
    @Inject(ALERT_MODULE_CONFIG_TOKEN) private readonly alertModuleConfig: AlertModuleConfig
  ) {}

  public readonly trackByFn: TrackByFunction<ComponentPortal<unknown>> = (
    _index: number,
    portal: ComponentPortal<unknown>
  ) => portal.injector.get(AlertRef).id;
}

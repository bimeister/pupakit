import { ChangeDetectionStrategy, Component, OnDestroy, TrackByFunction } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Alert, AlertsService } from './alerts.service';
import { ComponentDrawerData, DrawersService } from './drawers.service';
import { ModalWindowData, ModalWindowService } from './modal-window.service';

@Component({
  selector: 'pupa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnDestroy {
  public readonly componentDrawersList$: Observable<
    ComponentDrawerData[]
  > = this.drawersService.componentDrawersData$.pipe(
    map((collection: Map<string, ComponentDrawerData>) => Array.from(collection.values()))
  );

  public readonly modalWindowList$: Observable<ModalWindowData[]> = this.modalWindowService.modalWindowsData$.pipe(
    map((collection: Map<string, ModalWindowData>) => Array.from(collection.values()))
  );

  public readonly alertList$: Observable<Alert[]> = this.alertsService.alerts$.pipe(
    map((collection: Map<string, Alert>) => Array.from(collection.values()))
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly drawersService: DrawersService,
    private readonly alertsService: AlertsService,
    private readonly modalWindowService: ModalWindowService
  ) {}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly trackByDrawerId: TrackByFunction<ComponentDrawerData> = (_, item: ComponentDrawerData) => item.id;

  public readonly trackByModalWindowId: TrackByFunction<ModalWindowData> = (_, item: ModalWindowData) => item.id;

  public readonly trackByAlertId: TrackByFunction<Alert> = (_, item: Alert) => item.id;
}

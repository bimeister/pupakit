import { ChangeDetectionStrategy, Component, OnDestroy, TrackByFunction } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Alert } from '../../../../../internal/declarations/interfaces/alert.interface';
import { LoaderType } from '../../../../../internal/declarations/types/loader-type.type';
import { AlertsService } from '../../services/alerts.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'pupa-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnDestroy {
  public readonly alertList$: Observable<Alert[]> = this.alertsService.alerts$.pipe(
    map((collection: Map<string, Alert>) => Array.from(collection.values()))
  );

  public readonly isLoaderVisible$: Observable<boolean> = this.loaderService.isLoaderVisible$;
  public readonly loaderType$: Observable<LoaderType> = this.loaderService.loaderType$;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly loaderService: LoaderService, private readonly alertsService: AlertsService) {}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public readonly trackByAlertId: TrackByFunction<Alert> = (_, item: Alert) => item.id;
}

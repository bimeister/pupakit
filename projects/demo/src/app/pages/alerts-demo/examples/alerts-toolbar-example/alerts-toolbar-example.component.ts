import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AlertsService } from '@bimeister/pupakit.overlays';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'demo-alerts-toolbar-example',
  templateUrl: './alerts-toolbar-example.component.html',
  styleUrls: ['./alerts-toolbar-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('show', [
      state('false', style({ height: 0, opacity: 0 })),
      state('true', style({ height: '*', opacity: 1 })),

      transition('false => true', animate('500ms cubic-bezier(0.35, 0.7, 0.46, 0.96)')),
      transition('true => false', animate('300ms cubic-bezier(0.35, 0.7, 0.46, 0.96)')),
    ]),
  ],
})
export class AlertsToolbarExampleComponent {
  public readonly isVisible$: Observable<boolean> = this.alertsService.alertsCount$.pipe(
    map((alertsCount: number) => alertsCount > 5)
  );

  constructor(private readonly alertsService: AlertsService) {}

  public closeAll(): void {
    this.alertsService.closeAll();
  }
}

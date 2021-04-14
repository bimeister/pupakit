import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Alert } from '../../../src/internal/declarations/interfaces/alert.interface';
import { AlertType } from '../../../src/internal/declarations/types/alert.type';
import { AlertsService } from '../../../src/lib/components/layout/services/alerts.service';

@Component({
  selector: 'demo-overlay',
  styleUrls: ['../demo.scss', './layout-demo.component.scss'],
  templateUrl: './layout-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutDemoComponent {
  private readonly step: number = 0.25;

  constructor(private readonly alertsService: AlertsService) {}

  public addAlert(): void {
    const alert: Alert = {
      id: null,
      text: 'Текст сообщения',
      type: this.randomAlertType(),
      needToBeClosed: this.randomCloseMode()
    };
    this.alertsService.create(alert).subscribe();
  }

  private randomAlertType(): AlertType {
    const result: number = Math.random();
    return result < this.step
      ? 'info'
      : // tslint:disable-next-line: no-magic-numbers
      result < this.step * 2
      ? 'warning'
      : // tslint:disable-next-line: no-magic-numbers
      result < this.step * 3
      ? 'success'
      : 'danger';
  }

  private randomCloseMode(): boolean {
    const result: number = Math.random();
    // tslint:disable-next-line: no-magic-numbers
    return result < this.step * 2 ? true : false;
  }
}

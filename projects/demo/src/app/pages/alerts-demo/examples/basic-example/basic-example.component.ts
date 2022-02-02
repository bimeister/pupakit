import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AlertsService } from '../../../../../../../src/internal/shared/services/alerts.service';
import { OpenedAlert } from '../../../../../../../src/public-api';

@Component({
  selector: 'demo-basic-example',
  templateUrl: './basic-example.component.html',
  styleUrls: ['./basic-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BasicExampleComponent {
  constructor(private readonly alertsService: AlertsService) {}

  public openAlert(): void {
    const openedAlert: OpenedAlert<void> = this.alertsService.open({
      data: {
        bodyText: 'Some body text!',
        type: 'info',
        hasCloseButton: true,
        closeAction: () => openedAlert.close(),
        autoCloseTimeMs: 3000,
      },
    });
  }
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AlertsService } from '@kit/internal/shared/services/alerts.service';
import { OpenedAlert } from '@kit/public-api';

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

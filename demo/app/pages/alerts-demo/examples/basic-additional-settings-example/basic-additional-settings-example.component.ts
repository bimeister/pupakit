import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { OpenedAlert } from '../../../../../../src/internal/declarations/classes/opened-alert.class';
import { AlertsService } from '../../../../../../src/internal/shared/services/alerts.service';

@Component({
  selector: 'demo-basic-additional-settings-example',
  templateUrl: './basic-additional-settings-example.component.html',
  styleUrls: ['./basic-additional-settings-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class BasicAdditionalSettingsExampleComponent {
  constructor(private readonly alertsService: AlertsService) {}

  public openAlert(): void {
    const openedAlert: OpenedAlert<void> = this.alertsService.open({
      data: {
        bodyText: 'Some body text!',
        type: 'info',
        title: 'Some title',
        hasCloseButton: true,
        closeAction: () => openedAlert.close(),
        buttons: [
          {
            text: 'Button 1',
            kind: 'border-contrast',
            action: () => openedAlert.close(),
          },
          {
            text: 'Button 2',
            kind: 'subtle',
            action: () => openedAlert.close(),
          },
        ],
      },
    });
  }
}

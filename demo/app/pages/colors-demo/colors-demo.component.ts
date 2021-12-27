import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Alert, AlertsService } from '../../../../src/public-api';
import { ColorsService } from '../../../../src/internal/shared/services/colors.service';
import { ColorGroup } from '../../../../src/internal/declarations/classes/color-group.class';

const BASE_REQUEST_PATH: string = 'colors-demo/examples';

@Component({
  selector: 'demo-colors-demo',
  templateUrl: './colors-demo.component.html',
  styleUrls: ['./colors-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsDemoComponent {
  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    CSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.css`,
  };

  public readonly colorGroups: ColorGroup[] = this.colorsService.colorGroups;

  constructor(
    private readonly cdkClipboard: Clipboard,
    private readonly alertsService: AlertsService,
    private readonly colorsService: ColorsService
  ) {}

  public copyToClipboard(value: string): void {
    this.cdkClipboard.copy(value);
    this.showClipboardAlert(`Скопировано в буфер обмена: ${value}`);
  }

  private showClipboardAlert(text: string): void {
    const alert: Alert = {
      id: null,
      text,
      type: 'success',
      needToBeClosed: false,
    };
    this.alertsService.create(alert).subscribe();
  }
}

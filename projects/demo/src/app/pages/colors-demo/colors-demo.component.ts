import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ColorGroup } from '../../../../../src/internal/declarations/classes/color-group.class';
import { ColorsService } from '../../../../../src/internal/shared/services/colors.service';
import { ToastsService } from '../../../../../src/internal/shared/services/toasts.service';

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
    public readonly toastsService: ToastsService,
    private readonly colorsService: ColorsService
  ) {}

  public copyToClipboard(value: string): void {
    this.cdkClipboard.copy(value);
    this.showClipboardAlert(`Copied to clipboard: ${value}`);
  }

  private showClipboardAlert(text: string): void {
    this.toastsService.open({
      data: {
        bodyText: text,
        type: 'info',
      },
    });
  }
}

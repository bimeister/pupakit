import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ColorGroup } from '@kit/internal/declarations/classes/color-group.class';
import { SemanticColor } from '@kit/internal/declarations/classes/semantic-color.class';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { ColorsAlphaValuesConfig } from '@kit/internal/declarations/interfaces/colors-alpha-values-config.interface';
import { SemanticConfigurationGroup } from '@kit/internal/declarations/interfaces/semantic-configuration-group.interface';
import { ColorsAlphaValuesService } from '@kit/internal/shared/services/colors-alpha-values.service';
import { ColorsService } from '@kit/internal/shared/services/colors.service';
import { SemanticColorsService } from '@kit/internal/shared/services/semantic-colors.service';
import { ToastsService } from '@kit/internal/shared/services/toasts.service';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';

const BASE_REQUEST_PATH: string = 'colors-demo/examples';

interface Route {
  title: string;
  path: string;
  queryParams: Record<string, string>;
}

@Component({
  selector: 'demo-colors-demo',
  templateUrl: './colors-demo.component.html',
  styleUrls: ['./colors-demo.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsDemoComponent {
  public readonly routes: Route[] = [
    {
      title: 'Main Colors',
      path: '.',
      queryParams: { tab: 'main-colors' },
    },
    {
      title: 'Semantic Colors',
      path: '.',
      queryParams: { tab: 'semantic-colors' },
    },
  ];

  public readonly example1Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-1/example-1.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/example-1/example-1.component.scss`,
  };

  public readonly example2Content: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/example-2/example-2.component.html`,
    CSS: `${BASE_REQUEST_PATH}/example-2/example-2.component.css`,
  };

  public readonly semanticColorsUsageExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/semantic-color-usage-example/semantic-color-usage-example.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/semantic-color-usage-example/semantic-color-usage-example.component.scss`,
  };

  public readonly colorsUsageExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/color-usage-example/color-usage-example.component.html`,
    SCSS: `${BASE_REQUEST_PATH}/color-usage-example/color-usage-example.component.scss`,
  };

  public readonly colorGroups: ColorGroup[] = this.colorsService.colorGroups;
  public readonly alphaValues: ColorsAlphaValuesConfig.AlphaValue[] = this.colorsAlphaValuesService.config;
  public readonly semanticConfigurationGroups: SemanticConfigurationGroup[] = this.semanticColorsService.groups;

  public readonly theme$: Observable<Theme> = this.themeWrapperService.theme$;

  constructor(
    private readonly cdkClipboard: Clipboard,
    public readonly toastsService: ToastsService,
    private readonly colorsService: ColorsService,
    private readonly colorsAlphaValuesService: ColorsAlphaValuesService,
    private readonly semanticColorsService: SemanticColorsService,
    private readonly themeWrapperService: ThemeWrapperService
  ) {}

  public copyToClipboard(value: string): void {
    this.cdkClipboard.copy(value);
    this.showClipboardAlert(`Copied to clipboard: ${value}`);
  }

  public getSemanticColorNameByTheme(color: SemanticColor, theme: Theme): string {
    return theme === Theme.Light ? color.lightColorName : color.darkColorName;
  }

  public getSemanticAlphaValueNameByTheme(color: SemanticColor, theme: Theme): string {
    return theme === Theme.Light ? color.lightAlphaValueName : color.darkAlphaValueName;
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

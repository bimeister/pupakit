import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastsService } from '@bimeister/pupakit.overlays';

interface Preset {
  mixin: string;
  class: string;
  title: string;
}

@Component({
  selector: 'demo-typography-example-presets',
  templateUrl: './example-presets.component.html',
  styleUrls: ['./example-presets.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypographyPresetsComponent {
  public readonly headingPresets: Preset[] = Array(6)
    .fill(undefined)
    .map((_: undefined, index: number) => ({
      class: `font-preset-h${index + 1}`,
      mixin: `@include font-preset-h${index + 1};`,
      title: `h${index + 1}: PupaKit is an open source collection of Angular components`,
    }));

  public readonly captionPresets: Preset[] = ['m', 's', 'xs', 'xxs'].map((item: string) => ({
    class: `font-preset-caption-${item}`,
    mixin: `@include font-preset-caption-${item};`,
    title: `caption-${item}: PupaKit is an open source collection of Angular components`,
  }));

  public readonly bodyPresets: Preset[] = ['m', 's'].map((item: string) => ({
    class: `font-preset-body-${item}`,
    mixin: `@include font-preset-body-${item};`,
    title: `body-${item}: PupaKit is an open source collection of Angular components`,
  }));

  constructor(private readonly cdkClipboard: Clipboard, private readonly toastsService: ToastsService) {}

  public copyToClipBoard(mixin: string): void {
    this.cdkClipboard.copy(mixin);
    this.toastsService.open({
      data: {
        bodyText: 'Copied to clipboard',
        type: 'info',
      },
    });
  }
}

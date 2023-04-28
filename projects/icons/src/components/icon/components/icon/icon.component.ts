import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ComponentChanges } from '@bimeister/pupakit.common';
import { Nullable } from '@bimeister/utilities';
import { AVAILABLE_ICONS_TOKEN } from '../../../../declarations/tokens/available-icons.token';

@Component({
  selector: 'pupa-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnChanges {
  public iconHtmlCode: SafeHtml;

  @Input() public name: string;

  constructor(
    @Inject(AVAILABLE_ICONS_TOKEN) private readonly availableIconRegistries: Map<string, string>[],
    private readonly domSanitizer: DomSanitizer
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    const currentName: string = changes?.name?.currentValue;
    const data: string = this.getIconDataByName(currentName);
    this.iconHtmlCode = this.domSanitizer.bypassSecurityTrustHtml(data);
  }

  private getIconDataByName(name: Nullable<string>): Nullable<string> {
    const prefixes: string[] = ['m-', 'md-', 'ios-', 'logo-', 'app-'];
    const defaultPrefix: string = 'md-';
    const hasPrefix: boolean = prefixes.some((prefix: string) => name.startsWith(prefix));
    const nameWithPrefix: string = hasPrefix ? name : defaultPrefix + name;
    for (const registry of this.availableIconRegistries) {
      if (Boolean(registry.has(nameWithPrefix))) {
        return registry.get(nameWithPrefix);
      }
    }

    return null;
  }
}

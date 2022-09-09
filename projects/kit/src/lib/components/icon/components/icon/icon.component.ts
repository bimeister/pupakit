import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Nullable } from '@bimeister/utilities';
import { AVAILABLE_ICONS_TOKEN } from '../../../../../internal/constants/tokens/available-icons.token';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { IconRegistry } from '../../../../../internal/declarations/types/icon-registry.type';

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
    @Inject(AVAILABLE_ICONS_TOKEN) private readonly availableIconRegistries: IconRegistry[],
    private readonly domSanitizer: DomSanitizer
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    const currentName: string = changes?.name?.currentValue ?? null;
    const data: string = this.getIconDataByName(currentName);
    this.iconHtmlCode = this.domSanitizer.bypassSecurityTrustHtml(data);
  }

  private getIconDataByName(name: string): Nullable<string> {
    const prefixes: string[] = ['md-', 'ios-', 'logo-', 'app-'];
    const defaultPrefix: string = 'md-';
    const hasPrefix: boolean = prefixes.some((prefix: string) => name.startsWith(prefix));
    const nameWithPrefix: string = hasPrefix ? name : defaultPrefix + name;
    for (const registry of this.availableIconRegistries) {
      if (registry.has(nameWithPrefix)) {
        return registry.get(nameWithPrefix);
      }
    }

    return null;
  }
}

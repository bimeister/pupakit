import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconDefinition } from '@kit/public-api';
import { getAllIcons } from '../../../declarations/functions/get-all-icons.function';

@Component({
  selector: 'demo-icon-page',
  templateUrl: './icon-page.component.html',
  styleUrls: ['./icon-page.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPageComponent {
  public readonly iconNames: string[] = getAllIcons().map((icon: IconDefinition) => icon.name);
}

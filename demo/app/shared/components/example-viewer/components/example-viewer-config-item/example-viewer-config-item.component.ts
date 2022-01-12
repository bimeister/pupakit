import { ChangeDetectionStrategy, Component, ContentChild, Input, ViewEncapsulation } from '@angular/core';
import { ExampleViewerConfigItemDescriptionDirective } from '../../directives/example-viewer-config-item-description.directive';

@Component({
  selector: 'demo-example-viewer-config-item',
  templateUrl: './example-viewer-config-item.component.html',
  styleUrls: ['./example-viewer-config-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleViewerConfigItemComponent {
  @Input() public name: string;

  @ContentChild(ExampleViewerConfigItemDescriptionDirective, { static: true })
  public descriptionDirective: ExampleViewerConfigItemDescriptionDirective;
}

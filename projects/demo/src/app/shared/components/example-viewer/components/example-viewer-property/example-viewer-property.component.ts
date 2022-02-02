import { ChangeDetectionStrategy, Component, ContentChild, Input, ViewEncapsulation } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { ClientUiStateHandlerService } from '../../../../../../../../src/internal/shared/services/client-ui-state-handler.service';
import { ExampleViewerPropertyDescriptionDirective } from '../../directives/example-viewer-property-description.directive';

@Component({
  selector: 'demo-example-viewer-property',
  templateUrl: './example-viewer-property.component.html',
  styleUrls: ['./example-viewer-property.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleViewerPropertyComponent {
  @ContentChild(ExampleViewerPropertyDescriptionDirective, { static: true })
  public descriptionDirective: ExampleViewerPropertyDescriptionDirective;

  public readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsLessThanMd$;

  @Input() public name: string;
  @Input() public type: string;
  @Input() public decoratorName: Nullable<'input' | 'output'> = null;
  @Input() public description: string;

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}
}

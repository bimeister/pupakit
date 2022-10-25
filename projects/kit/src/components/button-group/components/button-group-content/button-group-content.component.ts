import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/button-group-state-service.token';
import { TabsContentBase } from '../../../../declarations/classes/abstract/tabs-content-base.abstract';
import { ContentTemplateNameDirective } from '../../../../declarations/interfaces/content-template-name.interface';
import { ButtonGroupItemContentTemplateDirective } from '../../directives/button-group-item-content-template.directive';
import { ButtonGroupStateService } from '../../services/button-group-state.service';

@Component({
  selector: 'pupa-button-group-content',
  templateUrl: './button-group-content.component.html',
  styleUrls: ['./button-group-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupContentComponent<T> extends TabsContentBase<T, ButtonGroupStateService<T>> {
  @Input() public destroyable: boolean = true;

  @ContentChildren(ButtonGroupItemContentTemplateDirective)
  public tabTemplates: QueryList<ContentTemplateNameDirective<T>>;

  constructor(@Inject(BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN) stateService: ButtonGroupStateService<T>) {
    super(stateService);
  }
}

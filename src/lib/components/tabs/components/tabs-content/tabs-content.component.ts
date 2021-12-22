import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  Inject,
  Input,
} from '@angular/core';
import { TabsItemContentTemplateDirective } from '../../directives/tabs-item-content-template.directive';
import { TabsStateService } from '../../services/tabs-state.service';
import { TABS_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/tabs-container-state-service.token';
import { TabsContentBase } from '../../../../../internal/declarations/classes/abstract/tabs-content-base.abstract';

@Component({
  selector: 'pupa-tabs-content',
  templateUrl: './tabs-content.component.html',
  styleUrls: ['./tabs-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsContentComponent<T> extends TabsContentBase<T, TabsStateService<T>> {
  @Input() public destroyable: boolean = true;
  @ContentChildren(TabsItemContentTemplateDirective) public tabTemplates: QueryList<
    TabsItemContentTemplateDirective<T>
  >;

  constructor(@Inject(TABS_CONTAINER_STATE_SERVICE_TOKEN) stateService: TabsStateService<T>) {
    super(stateService);
  }
}

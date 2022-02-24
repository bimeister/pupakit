import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Inject,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { TabsContentBase } from '../../../../../internal/api';
import { STEPPER_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/stepper-container-state-service.token';
import { TabsStateService } from '../../../api';
import { StepperItemContentDirective } from '../../directives/stepper-item-content.directive';
import { StepperStateService } from '../../services/stepper-state.service';

@Component({
  selector: 'pupa-stepper-content',
  templateUrl: './stepper-content.component.html',
  styleUrls: ['./stepper-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class StepperContentComponent<T> extends TabsContentBase<T, TabsStateService<T>> {
  @Input() public destroyable: boolean = true;

  @ContentChildren(StepperItemContentDirective) public tabTemplates: QueryList<StepperItemContentDirective<T>>;

  constructor(@Inject(STEPPER_CONTAINER_STATE_SERVICE_TOKEN) stateService: StepperStateService<T>) {
    super(stateService);
  }
}

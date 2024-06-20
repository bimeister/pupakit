import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filterNotNil, Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { STEPPER_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/stepper-container-state-service.token';
import { TabsItemBase } from '../../../../declarations/classes/abstract/tabs-item-base.abstract';
import { StepperItem } from '../../../../declarations/interfaces/stepper-item.interface';
import { TabsStateService } from '../../../tabs/services/tabs-state.service';
import { StepperRegistryService } from '../../services/stepper-registry.service';
import { StepperStateService } from '../../services/stepper-state.service';

@Component({
  selector: 'pupa-stepper-item',
  templateUrl: './stepper-item.component.html',
  styleUrls: ['./stepper-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class StepperItemComponent<T> extends TabsItemBase<T, TabsStateService<T>> implements OnInit, StepperItem<T> {
  @Input() public name: T;
  @Input() public isActive: Nullable<boolean>;
  @Input() public disabled: Nullable<boolean>;

  @Output() public readonly clickEvent: EventEmitter<VoidFunction> = new EventEmitter<VoidFunction>();

  @ViewChild('stepperItem', { static: true }) private readonly stepperItemElement: ElementRef;

  public readonly counter$: Observable<number> = this.stepperRegistryService.getStepperItemIndex(this).pipe(
    filterNotNil(),
    filter((counter: number) => counter > 0)
  );

  public readonly isLastStepperItem$: Observable<boolean> = this.stepperRegistryService.isLastStepperItem(this);

  constructor(
    private readonly stepperRegistryService: StepperRegistryService<T>,
    stateService: StepperStateService<T>,
    @Optional() @Inject(STEPPER_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: StepperStateService<T>
  ) {
    super(stateService, fromContainerStateService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.stateService.registerTabHtmlElement(this.name, this.stepperItemElement.nativeElement);
    this.stepperRegistryService.registerStepperItem(this);
  }
}

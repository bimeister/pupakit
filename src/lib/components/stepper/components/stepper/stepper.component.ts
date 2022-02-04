import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TabsBase } from '../../../../../internal/api';
import { STEPPER_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/stepper-container-state-service.token';
import { ScrollableComponent, TabsStateService } from '../../../api';
import { StepperRegistryService } from '../../services/stepper-registry.service';
import { StepperStateService } from '../../services/stepper-state.service';

@Component({
  selector: 'pupa-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [StepperStateService, StepperRegistryService],
})
export class StepperComponent<T> extends TabsBase<T, TabsStateService<T>> implements OnInit {
  @ViewChild('stepperContainer', { static: true }) private readonly stepperContainerRef: ElementRef<HTMLElement>;
  @ViewChild('scrollable', { static: true }) private readonly scrollable: ScrollableComponent;

  @Output() public readonly activeTabNameChange: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    stateService: StepperStateService<T>,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(STEPPER_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: StepperStateService<T>
  ) {
    super(stateService, changeDetectorRef, fromContainerStateService);
  }

  public ngOnInit(): void {
    this.stateService.registerHostHtmlElement(this.elementRef.nativeElement);
    this.stateService.registerScrollable(this.scrollable);
    this.stateService.registerTabsHtmlElement(this.stepperContainerRef.nativeElement);
  }
}

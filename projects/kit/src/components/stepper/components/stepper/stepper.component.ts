import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { STEPPER_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/stepper-container-state-service.token';
import { TabsBase } from '../../../../declarations/classes/abstract/tabs-base.abstract';
import { TabsStateService } from '../../../tabs/services/tabs-state.service';
import { StepperRegistryService } from '../../services/stepper-registry.service';
import { StepperStateService } from '../../services/stepper-state.service';
import { ScrollableComponent } from '../../../scrollable/components/scrollable/scrollable.component';

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
    ngZone: NgZone,
    @Optional() @Inject(STEPPER_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: StepperStateService<T>
  ) {
    super(stateService, changeDetectorRef, ngZone, fromContainerStateService);
  }

  public ngOnInit(): void {
    this.stateService.registerHostHtmlElement(this.elementRef.nativeElement);
    this.stateService.registerScrollable(this.scrollable);
    this.stateService.registerTabsHtmlElement(this.stepperContainerRef.nativeElement);
  }
}

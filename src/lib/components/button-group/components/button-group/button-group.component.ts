import {
  ChangeDetectionStrategy,
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
import { BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/button-group-state-service.token';
import { TabsBase } from '../../../../../internal/declarations/classes/abstract/tabs-base.abstract';
import { ScrollableComponent } from '../../../scrollable/components/scrollable/scrollable.component';
import { ButtonGroupStateService } from '../../services/button-group-state.service';

@Component({
  selector: 'pupa-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [ButtonGroupStateService],
})
export class ButtonGroupComponent<T> extends TabsBase<T, ButtonGroupStateService<T>> implements OnInit {
  @ViewChild('buttonGroupContainer', { static: true })
  private readonly buttonGroupContainerRef: ElementRef<HTMLElement>;
  @ViewChild('scrollable', { static: true }) private readonly scrollable: ScrollableComponent;

  @Output() public readonly activeTabNameChange: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    stateService: ButtonGroupStateService<T>,
    @Optional()
    @Inject(BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN)
    fromContainerStateService?: ButtonGroupStateService<T>
  ) {
    super(stateService, fromContainerStateService);
  }

  public ngOnInit(): void {
    this.stateService.registerHostHtmlElement(this.elementRef.nativeElement);
    this.stateService.registerScrollable(this.scrollable);
    this.stateService.registerTabsHtmlElement(this.buttonGroupContainerRef.nativeElement);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/button-group-state-service.token';
import { TabsItemBase } from '../../../../../internal/declarations/classes/abstract/tabs-item-base.abstract';
import { ButtonGroupStateService } from '../../services/button-group-state.service';

@Component({
  selector: 'pupa-button-group-item',
  templateUrl: './button-group-item.component.html',
  styleUrls: ['./button-group-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonGroupItemComponent extends TabsItemBase<ButtonGroupStateService> implements OnInit {
  @Input() public name: string = '';
  @Input() public isActive: Nullable<boolean>;
  @Input() public disabled: Nullable<boolean>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    stateService: ButtonGroupStateService,
    @Optional() @Inject(BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: ButtonGroupStateService
  ) {
    super(stateService, fromContainerStateService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.stateService.registerTabHtmlElement(this.name, this.elementRef.nativeElement);
  }
}

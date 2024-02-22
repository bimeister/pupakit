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
import { BUTTON_GROUP_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/button-group-state-service.token';
import { TabsItemBase } from '../../../../declarations/classes/abstract/tabs-item-base.abstract';
import { ButtonGroupStateService } from '../../services/button-group-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonGroupSize } from '../../../../declarations/types/button-group-size.type';

@Component({
  selector: 'pupa-button-group-item',
  templateUrl: './button-group-item.component.html',
  styleUrls: ['./button-group-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonGroupItemComponent<T> extends TabsItemBase<T, ButtonGroupStateService<T>> implements OnInit {
  @Input() public name: T;
  @Input() public isActive: Nullable<boolean>;
  @Input() public disabled: Nullable<boolean>;

  public readonly sizeClass$: Observable<string> = this.stateService.buttonGroupSize$.pipe(
    map((size: ButtonGroupSize) => `button-group-item_${size}`)
  );

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
    super.ngOnInit();
    this.stateService.registerTabHtmlElement(this.name, this.elementRef.nativeElement);
  }
}

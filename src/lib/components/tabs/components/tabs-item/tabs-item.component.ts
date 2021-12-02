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
import { TABS_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/tabs-container-state-service.token';
import { TabsItemBase } from '../../../../../internal/declarations/classes/abstract/tabs-item-base.abstract';
import { TabsStateService } from '../../services/tabs-state.service';

@Component({
  selector: 'pupa-tabs-item',
  templateUrl: './tabs-item.component.html',
  styleUrls: ['./tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TabsItemComponent extends TabsItemBase<TabsStateService> implements OnInit {
  @Input() public name: string = '';
  @Input() public isActive: Nullable<boolean>;
  @Input() public disabled: Nullable<boolean>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    stateService: TabsStateService,
    @Optional() @Inject(TABS_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: TabsStateService
  ) {
    super(stateService, fromContainerStateService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.stateService.registerTabHtmlElement(this.name, this.elementRef.nativeElement);
  }
}

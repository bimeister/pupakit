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
  ViewEncapsulation,
} from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { TABS_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/tabs-container-state-service.token';
import { TabsItemBase } from '../../../../declarations/classes/abstract/tabs-item-base.abstract';
import { TabsStateService } from '../../services/tabs-state.service';

@Component({
  selector: 'pupa-tabs-item',
  templateUrl: './tabs-item.component.html',
  styleUrls: ['./tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class TabsItemComponent<T> extends TabsItemBase<T, TabsStateService<T>> implements OnInit {
  @Input() public name: T;
  @Input() public isActive: Nullable<boolean>;
  @Input() public disabled: Nullable<boolean>;

  @Output() public readonly clickEvent: EventEmitter<VoidFunction> = new EventEmitter<VoidFunction>();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    stateService: TabsStateService<T>,
    @Optional() @Inject(TABS_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: TabsStateService<T>
  ) {
    super(stateService, fromContainerStateService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.stateService.registerTabHtmlElement(this.name, this.elementRef.nativeElement);
  }
}

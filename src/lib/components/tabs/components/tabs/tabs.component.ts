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
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TABS_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../../internal/constants/tokens/tabs-container-state-service.token';
import { TabsBase } from '../../../../../internal/declarations/classes/abstract/tabs-base.abstract';
import { ScrollableComponent } from '../../../scrollable/components/scrollable/scrollable.component';
import { TabsStateService } from '../../services/tabs-state.service';

@Component({
  selector: 'pupa-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [TabsStateService],
})
export class TabsComponent extends TabsBase<TabsStateService> implements OnInit {
  @ViewChild('tabsContainer', { static: true }) private readonly tabsContainerRef: ElementRef<HTMLElement>;
  @ViewChild('scrollable', { static: true }) private readonly scrollable: ScrollableComponent;

  @Output() public readonly activeTabNameChange: EventEmitter<string> = new EventEmitter<string>();

  private readonly railOffsetLeftPx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public readonly railOffsetLeftTransform$: Observable<string> = this.railOffsetLeftPx$.pipe(
    map((railOffsetLeft: number) => `translateX(${railOffsetLeft}px)`)
  );

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    stateService: TabsStateService,
    @Optional() @Inject(TABS_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: TabsStateService
  ) {
    super(stateService, fromContainerStateService);
  }

  public ngOnInit(): void {
    this.stateService.registerHostHtmlElement(this.elementRef.nativeElement);
    this.stateService.registerScrollable(this.scrollable);
    this.stateService.registerTabsHtmlElement(this.tabsContainerRef.nativeElement);
  }

  public processScrollLeft(scrollLeft: number): void {
    this.railOffsetLeftPx$.next(-scrollLeft);
  }
}

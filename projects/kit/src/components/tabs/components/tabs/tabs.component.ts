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
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TABS_CONTAINER_STATE_SERVICE_TOKEN } from '../../../../declarations/tokens/tabs-container-state-service.token';
import { TabsBase } from '../../../../declarations/classes/abstract/tabs-base.abstract';
import { TabsStateService } from '../../services/tabs-state.service';
import { ScrollableComponent } from '../../../scrollable/components/scrollable/scrollable.component';

@Component({
  selector: 'pupa-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [TabsStateService],
})
export class TabsComponent<T> extends TabsBase<T, TabsStateService<T>> implements OnInit {
  @ViewChild('tabsContainer', { static: true }) private readonly tabsContainerRef: ElementRef<HTMLElement>;
  @ViewChild('scrollable', { static: true }) private readonly scrollable: ScrollableComponent;
  @ViewChild('rail', { static: true }) private readonly railRef: ElementRef<HTMLElement>;

  @Output() public readonly activeTabNameChange: EventEmitter<T> = new EventEmitter<T>();

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    stateService: TabsStateService<T>,
    changeDetectorRef: ChangeDetectorRef,
    ngZone: NgZone,
    @Optional() @Inject(TABS_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: TabsStateService<T>
  ) {
    super(stateService, changeDetectorRef, ngZone, fromContainerStateService);
  }

  public ngOnInit(): void {
    this.stateService.registerHostHtmlElement(this.elementRef.nativeElement);
    this.stateService.registerScrollable(this.scrollable);
    this.stateService.registerTabsHtmlElement(this.tabsContainerRef.nativeElement);
  }

  public processScrollLeft(scrollLeft: number): void {
    this.renderer.setStyle(this.railRef?.nativeElement, 'transform', `translateX(${-scrollLeft}px)`);
  }
}

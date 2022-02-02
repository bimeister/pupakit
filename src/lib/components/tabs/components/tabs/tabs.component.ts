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
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
export class TabsComponent<T> extends TabsBase<T, TabsStateService<T>> implements OnInit {
  @ViewChild('tabsContainer', { static: true }) private readonly tabsContainerRef: ElementRef<HTMLElement>;
  @ViewChild('scrollable', { static: true }) private readonly scrollable: ScrollableComponent;
  @ViewChild('rail', { static: true }) private readonly railRef: ElementRef<HTMLElement>;

  @Output() public readonly activeTabNameChange: EventEmitter<T> = new EventEmitter<T>();

  public readonly isLeftGradient$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isRightGradient$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly renderer: Renderer2,
    stateService: TabsStateService<T>,
    @Optional() @Inject(TABS_CONTAINER_STATE_SERVICE_TOKEN) fromContainerStateService?: TabsStateService<T>
  ) {
    super(stateService, fromContainerStateService);
  }

  public ngOnInit(): void {
    this.stateService.registerHostHtmlElement(this.elementRef.nativeElement);
    this.stateService.registerScrollable(this.scrollable);
    this.stateService.registerTabsHtmlElement(this.tabsContainerRef.nativeElement);
  }

  public processScrollLeft(scrollLeft: number): void {
    this.renderer.setStyle(this.railRef?.nativeElement, 'transform', `translateX(${-scrollLeft}px)`);
  }

  public setLeftGradient(isLeftGradient: boolean): void {
    this.isLeftGradient$.next(isLeftGradient);
    this.detectChanges();
  }

  public setRightGradient(isRightGradient: boolean): void {
    this.isRightGradient$.next(isRightGradient);
    this.detectChanges();
  }

  private detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }
}

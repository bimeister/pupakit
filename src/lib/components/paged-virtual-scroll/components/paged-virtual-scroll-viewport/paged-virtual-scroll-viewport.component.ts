import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Observable, Subscription, BehaviorSubject } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { PagedVirtualScrollStateService } from '../../services/paged-virtual-scroll-state.service';

const DEBOUNCE_TIME_MS: number = 500;

@Component({
  selector: 'pupa-paged-virtual-scroll-viewport',
  templateUrl: './paged-virtual-scroll-viewport.component.html',
  styleUrls: ['./paged-virtual-scroll-viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [PagedVirtualScrollStateService]
})
export class PagedVirtualScrollViewportComponent implements OnInit {
  @ViewChild('iframe', { static: true }) private readonly iframeElementRef: ElementRef<HTMLIFrameElement>;

  private readonly viewportSize$: BehaviorSubject<ClientRect> = this.pagedVirtualScrollStateService.viewportSize$;

  public readonly contentHeight$: Observable<number> = this.pagedVirtualScrollStateService.contentHeight$;
  public readonly contentTranslateY$: Observable<number> = this.pagedVirtualScrollStateService.contentTranslateY$;

  private readonly wheelEvent$: BehaviorSubject<WheelEvent> = this.pagedVirtualScrollStateService.wheelEvent$;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService,
    private readonly hostElement: ElementRef<HTMLElement>
  ) {}

  public ngOnInit(): void {
    this.subscription.add(this.handleIframeResizeEvents()).add(this.handleWheelEvents());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleIframeResizeEvents(): Subscription {
    return fromEvent(this.iframeElementRef.nativeElement.contentWindow, 'resize')
      .pipe(startWith(new Event('resize')), debounceTime(DEBOUNCE_TIME_MS))
      .subscribe(() => {
        const viewportSize: ClientRect = this.iframeElementRef.nativeElement.getBoundingClientRect();
        this.viewportSize$.next(viewportSize);
      });
  }

  private handleWheelEvents(): Subscription {
    return fromEvent(this.hostElement.nativeElement, 'wheel').subscribe((event: WheelEvent) =>
      this.wheelEvent$.next(event)
    );
  }
}

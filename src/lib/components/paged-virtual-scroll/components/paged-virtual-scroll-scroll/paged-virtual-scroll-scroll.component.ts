import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { PagedVirtualScrollStateService } from '../../services/paged-virtual-scroll-state.service';
import { filterNotNil } from '@bimeister/utilities';

const NORMALIZED_DELTA_COEFFICIENT: number = 1.5;

@Component({
  selector: 'pupa-paged-virtual-scroll-scroll',
  templateUrl: './paged-virtual-scroll-scroll.component.html',
  styleUrls: ['./paged-virtual-scroll-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class PagedVirtualScrollScrollComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer', { static: true }) public scrollContainer: ElementRef<HTMLDivElement>;

  public readonly contentHeight$: Observable<number> = this.pagedVirtualScrollStateService.contentHeight$;
  public readonly viewportSize$: Observable<ClientRect> = this.pagedVirtualScrollStateService.viewportSize$;
  public readonly scroll$: BehaviorSubject<number> = this.pagedVirtualScrollStateService.scroll$;

  public readonly wheelEvent$: BehaviorSubject<WheelEvent> = this.pagedVirtualScrollStateService.wheelEvent$;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService) {}

  public ngOnInit(): void {
    this.subscription.add(this.handleWheelEvent()).add(this.handleScrollEvent());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleWheelEvent(): Subscription {
    return this.wheelEvent$.pipe(filterNotNil()).subscribe((event: WheelEvent) => {
      const delta: number = event.deltaY || event.detail;
      const normalizedDelta: number = delta * NORMALIZED_DELTA_COEFFICIENT;

      const scrollContainer: HTMLElement = this.scrollContainer.nativeElement;
      const { scrollTop: currentScrollTop }: HTMLElement = scrollContainer;

      const newScrollTop: number = currentScrollTop + normalizedDelta;

      scrollContainer.scrollTo({ top: newScrollTop });
    });
  }

  private handleScrollEvent(): Subscription {
    return fromEvent<WheelEvent>(this.scrollContainer.nativeElement, 'scroll')
      .pipe(withLatestFrom(this.contentHeight$, this.viewportSize$))
      .subscribe(([_event, contentHeight, { height }]: [WheelEvent, number, ClientRect]) =>
        this.scroll$.next(this.scrollContainer.nativeElement.scrollTop / (contentHeight - height))
      );
  }
}

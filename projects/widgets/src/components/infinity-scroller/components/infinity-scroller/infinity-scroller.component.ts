import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  TrackByFunction,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { EventBus } from '@bimeister/event-bus/rxjs';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { ScrollableComponent, ScrollDirection } from '@bimeister/pupakit.kit';
import {
  filterByInstanceOf,
  filterNotNil,
  filterTruthy,
  intersectionObservable,
  isNil,
  Nullable,
} from '@bimeister/utilities';
import { asyncScheduler, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, observeOn, skip, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { InfiniteScrollerScrollService } from '../../../../components/infinity-scroller/services/infinite-scroller-scroll.service';
import { InfinityScrollerController } from '../../../../declarations/classes/infinity-scroller-controller.class';
import { ScrollMoveDirection } from '../../../../declarations/enums/scroll-move-direction.enum';
import { InfinityScrollerEvents } from '../../../../declarations/events/infinity-scroller.events';
import { InfiniteScrollerItemTemplateDirective } from '../../directives/infinite-scroller-item-template.directive';
import { InfiniteScrollerBottomItemTemplateDirective } from '../../directives/infinity-scroller-bottom-item-template.directive';
import { InfiniteScrollerTopItemTemplateDirective } from '../../directives/infinity-scroller-top-item-template.directive';

const DEFAULT_SCROLL_INTO_VIEW_OPTIONS: ScrollIntoViewOptions = {
  block: 'nearest',
  behavior: 'smooth',
};
const SCROLL_ANIMATION_DURATION_MS: number = 500;

@Component({
  selector: 'pupa-infinity-scroller',
  templateUrl: './infinity-scroller.component.html',
  styleUrls: ['./infinity-scroller.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InfiniteScrollerScrollService],
})
export class InfinityScrollerComponent<T> implements OnChanges, AfterViewInit, OnDestroy {
  @Input() public controller: InfinityScrollerController<T>;
  private readonly controller$: BehaviorSubject<Nullable<InfinityScrollerController<T>>> = new BehaviorSubject<
    InfinityScrollerController<T>
  >(null);
  private readonly availableController$: Observable<InfinityScrollerController<T>> = this.controller$.pipe(
    filterNotNil()
  );

  @ViewChild(ScrollableComponent) private readonly scrollable: ScrollableComponent;
  @ViewChild('anchorTop') private readonly anchorTop: ElementRef<HTMLElement>;
  @ViewChild('anchorBottom') private readonly anchorBottom: ElementRef<HTMLElement>;

  @ContentChild(InfiniteScrollerItemTemplateDirective)
  public infiniteScrollItemTemplate: InfiniteScrollerItemTemplateDirective<T>;
  @ContentChild(InfiniteScrollerTopItemTemplateDirective)
  public infiniteScrollTopItemTemplate: InfiniteScrollerTopItemTemplateDirective;
  @ContentChild(InfiniteScrollerBottomItemTemplateDirective)
  public infiniteScrollBottomItemTemplate: InfiniteScrollerBottomItemTemplateDirective;

  @ViewChildren('scrollEntry', { read: ElementRef })
  private readonly entries: QueryList<ElementRef<HTMLElement>>;

  public readonly data$: Observable<T[]> = this.availableController$.pipe(
    switchMap((controller: InfinityScrollerController<T>) => controller.data$)
  );

  public readonly eventBus$: Observable<EventBus> = this.availableController$.pipe(
    map((controller: InfinityScrollerController<T>) => controller.eventBus)
  );

  private readonly scrollMoveDirection$: Observable<ScrollMoveDirection> = this.availableController$.pipe(
    map((controller: InfinityScrollerController<T>) => controller.scrollMoveDirection)
  );

  public readonly trackBy$: Observable<TrackByFunction<T>> = this.availableController$.pipe(
    switchMap((controller: InfinityScrollerController<T>) => controller.trackBy$)
  );

  public readonly isEntriesFirstTimeRendered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly infiniteScrollerScrollService: InfiniteScrollerScrollService) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processControllerChanges(changes.controller);
  }

  public ngAfterViewInit(): void {
    this.subscription.add(this.handleEntriesChanges());
    this.subscription.add(this.registerTopAnchorIntersectionObserver());
    this.subscription.add(this.registerBottomAnchorIntersectionObserver());
    this.subscription.add(this.processTopContentChange());

    this.subscription.add(this.handleScrollToBottomEvents());
    this.subscription.add(this.handleScrollToTopEvents());
    this.subscription.add(this.handleScrollToIndexEvents());

    this.processInitialScrollToBottom();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onVerticalScrollDirectionChanged(direction: ScrollDirection): void {
    this.infiniteScrollerScrollService.scrollDirection$.next(direction);
  }

  public scrolledToVerticalStart(event: boolean): void {
    this.availableController$
      .pipe(take(1))
      .subscribe((controller: InfinityScrollerController<T>) => controller.setScrolledToVerticalStartState(event));
  }

  public scrolledToVerticalEnd(event: boolean): void {
    this.availableController$
      .pipe(take(1))
      .subscribe((controller: InfinityScrollerController<T>) => controller.setScrolledToVerticalEndState(event));
  }

  private processControllerChanges(change: ComponentChange<this, InfinityScrollerController<T>>): void {
    const controller: InfinityScrollerController<T> = change?.currentValue;
    if (isNil(controller)) {
      return;
    }
    this.controller$.next(controller);
  }

  private handleEntriesChanges(): Subscription {
    return this.entries.changes.subscribe(() => {
      this.isEntriesFirstTimeRendered$.next(true);
    });
  }

  private registerTopAnchorIntersectionObserver(): Subscription {
    return intersectionObservable(this.anchorTop.nativeElement, {
      root: this.scrollable.element,
    })
      .pipe(
        skip(1),
        map(([entry]: IntersectionObserverEntry[]) => entry.isIntersecting),
        filterTruthy(),
        withLatestFrom(this.availableController$)
      )
      .subscribe(([_, controller]: [boolean, InfinityScrollerController<T>]) => {
        this.infiniteScrollerScrollService.cacheContentHeight(this.scrollable.element);

        controller.handleTopAnchorIntersect();
      });
  }

  private registerBottomAnchorIntersectionObserver(): Subscription {
    return intersectionObservable(this.anchorBottom.nativeElement, {
      root: this.scrollable.element,
    })
      .pipe(
        skip(1),
        map(([entry]: IntersectionObserverEntry[]) => entry.isIntersecting),
        filterTruthy(),
        withLatestFrom(this.availableController$)
      )
      .subscribe(([_, controller]: [boolean, InfinityScrollerController<T>]) => {
        controller.handleBottomAnchorIntersect();
      });
  }

  private processTopContentChange(): Subscription {
    return this.entries.changes
      .pipe(
        skip(1),
        withLatestFrom(
          this.infiniteScrollerScrollService.cacheContentHeight$,
          this.infiniteScrollerScrollService.scrollDirection$
        ),
        filter(
          ([_entries, _cacheContentHeight, scrollDirection]: [
            QueryList<ElementRef<HTMLElement>>,
            number,
            ScrollDirection
          ]) => scrollDirection === 'up'
        )
      )
      .subscribe(
        ([_entries, cacheContentHeight, _scrollDirection]: [
          QueryList<ElementRef<HTMLElement>>,
          number,
          ScrollDirection
        ]) => {
          const scrollHeight: number = this.scrollable.element.scrollHeight;
          const newScrollTop: number = scrollHeight - cacheContentHeight;

          this.scrollable.setScrollTop(newScrollTop);
        }
      );
  }

  private processInitialScrollToBottom(): void {
    this.scrollMoveDirection$
      .pipe(
        take(1),
        filter((scrollDirection: ScrollMoveDirection) => scrollDirection === ScrollMoveDirection.FromBottomToTop),
        switchMap(() => this.entries.changes),
        take(1)
      )
      .subscribe(() => this.scrollable.scrollToBottom());
  }

  private handleScrollToTopEvents(): Subscription {
    return this.eventBus$
      .pipe(
        switchMap((eventBus: EventBus) => eventBus.listen()),
        filterByInstanceOf(InfinityScrollerEvents.ScrollToTop),
        map((event: InfinityScrollerEvents.ScrollToTop) => event.afterRender)
      )
      .subscribe((afterRender: boolean) => {
        if (!afterRender) {
          this.scrollable.scrollToTop();

          return;
        }

        this.entries.changes.pipe(take(1)).subscribe(() => this.scrollable.scrollToTop());
      });
  }

  private handleScrollToBottomEvents(): Subscription {
    return this.eventBus$
      .pipe(
        switchMap((eventBus: EventBus) => eventBus.listen()),
        filterByInstanceOf(InfinityScrollerEvents.ScrollToBottom),
        map((event: InfinityScrollerEvents.ScrollToBottom) => event.afterRender)
      )
      .subscribe((afterRender: boolean) => {
        if (!afterRender) {
          this.scrollable.scrollToBottom();

          return;
        }

        this.entries.changes.pipe(take(1)).subscribe(() => this.scrollable.scrollToBottom());
      });
  }

  private handleScrollToIndexEvents(): Subscription {
    return this.eventBus$
      .pipe(
        switchMap((eventBus: EventBus) => eventBus.listen()),
        filterByInstanceOf(InfinityScrollerEvents.ScrollToIndex),
        withLatestFrom(this.availableController$)
      )
      .subscribe(
        ([{ scrollToIndex, scrollOptions }, controller]: [
          InfinityScrollerEvents.ScrollToIndex,
          InfinityScrollerController<T>
        ]) => {
          this.isEntriesFirstTimeRendered$.pipe(filterTruthy(), take(1)).subscribe(() => {
            if (controller.sliceIndexesProducer.isIndexInCurrentSlice(scrollToIndex)) {
              this.scrollToRenderedElement(controller, scrollToIndex, scrollOptions);
              return;
            }

            controller.handleGetSpecificSlice(scrollToIndex);
            this.scrollToElementAfterRender(scrollToIndex, scrollOptions);
          });
        }
      );
  }

  private scrollToRenderedElement(
    controller: InfinityScrollerController<T>,
    scrollToIndex: number,
    scrollOptions: Nullable<ScrollIntoViewOptions>
  ): void {
    const actualElementIndex: number = controller.sliceIndexesProducer.getHtmlElementIndex(scrollToIndex);
    const scrollerItem: ElementRef<HTMLElement> | undefined = this.entries.find(
      (_: ElementRef<HTMLElement>, index: number) => index === actualElementIndex
    );
    const elementToScroll: ChildNode | undefined = scrollerItem?.nativeElement.firstChild;

    if (!(elementToScroll instanceof HTMLElement)) {
      return;
    }

    const scrollIntoViewOptions: ScrollIntoViewOptions = isNil(scrollOptions)
      ? DEFAULT_SCROLL_INTO_VIEW_OPTIONS
      : scrollOptions;

    setTimeout(() => {
      elementToScroll.scrollIntoView(scrollIntoViewOptions);
      this.controller.setScrolledToIndexInSpecificSlice(true);
    }, SCROLL_ANIMATION_DURATION_MS);
  }

  private scrollToElementAfterRender(scrollToIndex: number, scrollOptions: Nullable<ScrollIntoViewOptions>): void {
    this.entries.changes
      .pipe(
        observeOn(asyncScheduler),
        take(1),
        switchMap(() => this.availableController$)
      )
      .subscribe((controller: InfinityScrollerController<T>) => {
        this.scrollToRenderedElement(controller, scrollToIndex, scrollOptions);
      });
  }
}

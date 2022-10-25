import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InfinityScrollerController, InfinityScrollerEvents, ScrollMoveDirection } from '@bimeister/pupakit.widgets';
import { filterNotEmpty } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, delay, map, startWith } from 'rxjs/operators';

const DEFAULT_REQUEST_DELAY_MS: number = 300;
const MIN_DEFAULT_REQUEST_DELAY_MS: number = 150;

const ROWS_COUNT: number = 100;
const DEFAULT_SKIP: number = 0;
const DEFAULT_TAKE: number = 20;

@Component({
  selector: 'demo-infinity-scroller-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfinityScrollerExample4Component implements OnInit, OnDestroy {
  public readonly controller: InfinityScrollerController<string> = new InfinityScrollerController<string>({
    scrollMoveDirection: ScrollMoveDirection.FromTopToBottom,
    bufferSize: 50,
    trackBy: (_: number, item: string) => item,
  });

  public readonly total: number = ROWS_COUNT;
  public readonly totalRendered$: Observable<number> = this.controller.total$;
  public readonly event$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public readonly scrollToIndexControl: FormControl = new FormControl('');

  public readonly itemType: string;

  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.subscription.add(this.handleGetNextPageEvents());
    this.subscription.add(this.handleGetPreviousPageEvent());
    this.subscription.add(this.handleGetSpecificPageEvent());
    this.initializeScroller();
    this.subscription.add(this.handleScrollToIndexChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeScroller(): void {
    this.controller.initialize({
      startIndex: DEFAULT_SKIP,
      endIndex: DEFAULT_TAKE,
      pageSize: DEFAULT_TAKE,
    });
  }

  private handleGetNextPageEvents(): Subscription {
    return this.controller
      .getEvents(InfinityScrollerEvents.GetNextPage)
      .pipe(
        map(({ payload, offset: { startIndex, itemsCount } }: InfinityScrollerEvents.GetNextPage) => {
          this.event$.next(`InfinityScrollerEvents.GetNextPage(skip: ${startIndex}, take: ${itemsCount})`);
          return [...payload, ...this.generateData(itemsCount, startIndex)];
        }),
        delay(Math.random() * DEFAULT_REQUEST_DELAY_MS + MIN_DEFAULT_REQUEST_DELAY_MS)
      )
      .subscribe((data: string[]) => {
        this.controller.sliceIndexesProducer.setTotalCount(ROWS_COUNT);
        this.controller.setData(data);
      });
  }

  private handleGetPreviousPageEvent(): Subscription {
    return this.controller
      .getEvents(InfinityScrollerEvents.GetPreviousPage)
      .pipe(
        map(({ payload, offset: { startIndex, itemsCount } }: InfinityScrollerEvents.GetPreviousPage) => {
          this.event$.next(`InfinityScrollerEvents.GetPreviousPage(skip: ${startIndex}, take: ${itemsCount})`);

          return [...this.generateData(itemsCount, startIndex), ...payload];
        }),
        delay(Math.random() * DEFAULT_REQUEST_DELAY_MS + MIN_DEFAULT_REQUEST_DELAY_MS)
      )
      .subscribe((data: string[]) => {
        this.controller.sliceIndexesProducer.setTotalCount(ROWS_COUNT);
        this.controller.setData(data);
      });
  }

  private handleGetSpecificPageEvent(): Subscription {
    return this.controller
      .getEvents(InfinityScrollerEvents.GetSpecificPage)
      .pipe(
        map(({ offset: { startIndex, itemsCount } }: InfinityScrollerEvents.GetSpecificPage) => {
          this.event$.next(`InfinityScrollerEvents.GetSpecificPage(skip: ${startIndex}, take: ${itemsCount})`);

          return [...this.generateData(itemsCount, startIndex)];
        }),
        delay(Math.random() * DEFAULT_REQUEST_DELAY_MS + MIN_DEFAULT_REQUEST_DELAY_MS)
      )
      .subscribe((data: string[]) => {
        this.controller.sliceIndexesProducer.setTotalCount(ROWS_COUNT);
        this.controller.setData(data);
      });
  }

  private handleScrollToIndexChanges(): Subscription {
    return this.scrollToIndexControl.valueChanges
      .pipe(debounceTime(1000), startWith(this.scrollToIndexControl.value), filterNotEmpty())
      .subscribe((scrollToIndex: number) => {
        this.controller.dispatchEvent(new InfinityScrollerEvents.ScrollToIndex(+scrollToIndex));
      });
  }

  private generateData(_: number, startIndex: number): string[] {
    const data: string[] = Array(ROWS_COUNT)
      .fill(1)
      .map((__: any, index: number) => index.toString());

    return data.splice(startIndex, DEFAULT_TAKE);
  }
}

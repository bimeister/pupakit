import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { InfinityScrollerController, InfinityScrollerEvents, ScrollMoveDirection } from '@bimeister/pupakit.widgets';
import { getUuid, Uuid } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';

type UserId = `userId${number}`;

interface Item {
  id: Uuid;
  message: string;
  user: {
    id: UserId;
    name: string;
  };
}

const DEFAULT_REQUEST_DELAY_MS: number = 300;
const MIN_DEFAULT_REQUEST_DELAY_MS: number = 150;

const ROWS_COUNT: number = 200;
const DEFAULT_SKIP: number = 0;
const DEFAULT_TAKE: number = 20;

const MESSAGES: string[] = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua!!!',
  'Dui accumsan sit amet nulla facilisi morbi tempus iaculis urna. Nullam non nisi est sit amet. A diam sollicitudin tempor id. Vel orci porta non pulvinar neque. Mattis molestie a iaculis at erat.',
  'Malesuada nunc vel risus commodo viverra. Dictumst quisque sagittis purus sit. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Pulvinar mattis nunc sed blandit libero volutpat. Elit sed vulputate mi sit amet mauris commodo quis. Felis bibendum ut tristique et egestas quis!',
  'Vel eros donec ac odio tempor. Sed lectus vestibulum mattis ullamcorper. Pellentesque massa placerat duis ultricies lacus sed turpis. Mi quis hendrerit dolor magna eget. A arcu cursus vitae congue mauris rhoncus. Maecenas volutpat blandit aliquam etiam erat velit scelerisque.',
  'Magna fringilla urna porttitor rhoncus dolor purus non enim praesent?',
  'In arcu cursus euismod quis?',
  'Ullamcorper sit amet risus nullam. Eget mauris pharetra et ultrices neque ornare aenean euismod elementum. Vitae et leo duis ut diam quam nulla.',
  'Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Commodo nulla facilisi nullam vehicula ipsum. Mattis nunc sed blandit libero volutpat sed. Orci nulla pellentesque dignissim enim sit amet. Facilisi nullam vehicula ipsum a arcu cursus vitae congue mauris.',
  'Ut morbi tincidunt augue interdum velit euismod in pellentesque?',
  'Turpis massa sed elementum tempus egestas. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In fermentum et sollicitudin ac orci phasellus egestas.',
];

@Component({
  selector: 'demo-infinity-scroller-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfinityScrollerExample2Component implements OnInit, OnDestroy {
  public readonly controller: InfinityScrollerController<Item> = new InfinityScrollerController<Item>({
    scrollMoveDirection: ScrollMoveDirection.FromTopToBottom,
    trackBy: (_: number, item: Item) => item.id,
  });

  public readonly total: number = ROWS_COUNT;
  public readonly totalRendered$: Observable<number> = this.controller.total$;
  public readonly event$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public readonly itemType: Item;

  private readonly subscription: Subscription = new Subscription();

  public readonly currentUserId: UserId = 'userId0';
  private readonly userNameById: Record<UserId, string> = {
    userId0: 'P. Pupa',
    userId1: 'L. Lupa',
  };

  public ngOnInit(): void {
    this.subscription.add(this.handleGetNextPageEvents());
    this.subscription.add(this.handleGetPreviousPageEvent());
    this.initializeScroller();
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

          return [...payload, ...this.generateData(itemsCount)];
        }),
        delay(Math.random() * DEFAULT_REQUEST_DELAY_MS + MIN_DEFAULT_REQUEST_DELAY_MS)
      )
      .subscribe((data: Item[]) => {
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

          return [...this.generateData(itemsCount), ...payload];
        }),
        delay(Math.random() * DEFAULT_REQUEST_DELAY_MS + MIN_DEFAULT_REQUEST_DELAY_MS)
      )
      .subscribe((data: Item[]) => {
        this.controller.sliceIndexesProducer.setTotalCount(ROWS_COUNT);
        this.controller.setData(data);
      });
  }

  private generateData(count: number): Item[] {
    return Array(count)
      .fill(1)
      .map(() => {
        const randomUserId: number = Math.random() < 0.5 ? 0 : 1;
        const userId: UserId = `userId${randomUserId}`;

        return {
          id: getUuid(),
          message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
          user: {
            id: userId,
            name: this.userNameById[userId],
          },
        };
      });
  }
}

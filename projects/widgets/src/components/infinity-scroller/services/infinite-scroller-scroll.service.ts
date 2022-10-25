import { Injectable } from '@angular/core';
import { ScrollDirection } from '@bimeister/pupakit.kit';
import { Nullable } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InfiniteScrollerScrollService {
  public readonly scrollDirection$: BehaviorSubject<Nullable<ScrollDirection>> = new BehaviorSubject<
    Nullable<ScrollDirection>
  >(null);
  public readonly cacheContentHeight$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public cacheContentHeight(element: HTMLElement): void {
    const currentContentHeight: number = element.scrollHeight - element.scrollTop;
    this.cacheContentHeight$.next(currentContentHeight);
  }
}

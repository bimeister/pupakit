import { Injectable, OnDestroy } from '@angular/core';
import { filterNotNil } from '@bimeister/utilities';

import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { distinctUntilChanged, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SidebarScrollDelay } from '../../../declarations/enums/sidebar-scroll-delay.enum';

@Injectable()
export class SidebarScrollService implements OnDestroy {
  private readonly delay$: BehaviorSubject<number> = new BehaviorSubject<number>(SidebarScrollDelay.Long);
  private readonly activeNode$: BehaviorSubject<HTMLElement> = new BehaviorSubject<HTMLElement>(null);
  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.subscription.add(this.initSidebarScrollService());
  }

  public configureSidebarScroll(node: HTMLElement, delay: number = SidebarScrollDelay.Default): void {
    this.delay$.next(delay);
    this.activeNode$.next(node);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initSidebarScrollService(): Subscription {
    return this.activeNode$
      .pipe(
        filterNotNil(),
        distinctUntilChanged(),
        withLatestFrom(this.delay$),
        switchMap(([node, delay]: [HTMLElement, number]) => timer(delay).pipe(map(() => node)))
      )
      .subscribe((node: HTMLElement) => {
        node.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      });
  }
}

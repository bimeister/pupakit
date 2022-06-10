import {
  filterNotNil,
  isEmpty,
  isNil,
  Nullable,
  resizeObservable,
  shareReplayWithRefCount,
} from '@bimeister/utilities';
import { asyncScheduler, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, observeOn, subscribeOn, switchMap, take } from 'rxjs/operators';
import { ScrollableComponent } from '../../../../lib/components/scrollable/components/scrollable/scrollable.component';

export abstract class TabsServiceBase<T> {
  protected readonly tabNameToHtmlElementMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
  private readonly activeTabNameState$: BehaviorSubject<Nullable<T>> = new BehaviorSubject<Nullable<T>>(null);
  public readonly activeTabName$: Observable<Nullable<T>> = this.activeTabNameState$.asObservable();

  protected readonly hostElement$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<Nullable<HTMLElement>>(
    null
  );
  protected readonly scrollable$: BehaviorSubject<Nullable<ScrollableComponent>> = new BehaviorSubject<
    Nullable<ScrollableComponent>
  >(null);
  protected readonly tabsHtmlElement$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<
    Nullable<HTMLElement>
  >(null);

  private readonly activeHtmlElement$: Observable<HTMLElement> = this.activeTabName$.pipe(
    filterNotNil(),
    map((activeTabName: T) => this.tabNameToHtmlElementMap.get(JSON.stringify(activeTabName))),
    shareReplayWithRefCount()
  );

  private readonly tabsContainerResize$: Observable<ResizeObserverEntry[]> = this.tabsHtmlElement$.pipe(
    filterNotNil(),
    switchMap((tabsHtmlElement: HTMLElement) => resizeObservable(tabsHtmlElement))
  );

  public readonly railHighlighterOffsetLeftPx$: Observable<number> = combineLatest([
    this.activeHtmlElement$.pipe(filterNotNil()),
    this.tabsHtmlElement$.pipe(filterNotNil()),
    this.tabsContainerResize$,
  ]).pipe(
    observeOn(asyncScheduler),
    map(([activeHtmlElement, tabsHtmlElement]: [HTMLElement, HTMLElement, ResizeObserverEntry[]]) => {
      const activeClientRect: ClientRect = activeHtmlElement.getBoundingClientRect();
      const tabsClientRect: ClientRect = tabsHtmlElement.getBoundingClientRect();
      return activeClientRect.left - tabsClientRect.left;
    })
  );
  public readonly railHighlighterWidthPx$: Observable<number> = combineLatest([
    this.activeHtmlElement$,
    this.tabsContainerResize$,
  ]).pipe(map(([activeHtmlElement]: [HTMLElement, ResizeObserverEntry[]]) => activeHtmlElement.clientWidth));

  private readonly tabNames: T[] = [];

  private readonly isContentDraggingState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isContentDragging$: Observable<boolean> = this.isContentDraggingState$.pipe(distinctUntilChanged());

  public registerTab(tabName: T): void {
    this.tabNames.push(tabName);
  }

  public setInitialTab(): void {
    this.activeTabName$
      .pipe(
        take(1),
        filter((activeTab: Nullable<T>) => isNil(activeTab) && !isEmpty(this.tabNames)),
        subscribeOn(asyncScheduler)
      )
      .subscribe(() => {
        this.setActiveTab(this.tabNames[0]);
      });
  }

  public setActiveTab(tabName: T): void {
    this.activeTabNameState$.next(tabName);
    this.correctScrollLeftByTargetTab(tabName);
  }

  public registerTabsHtmlElement(htmlElement: HTMLElement): void {
    this.tabsHtmlElement$.next(htmlElement);
  }

  public registerHostHtmlElement(htmlElement: HTMLElement): void {
    this.hostElement$.next(htmlElement);
  }

  public registerScrollable(scrollable: ScrollableComponent): void {
    this.scrollable$.next(scrollable);
  }

  public registerTabHtmlElement(tabName: T, htmlElement: HTMLElement): void {
    this.tabNameToHtmlElementMap.set(JSON.stringify(tabName), htmlElement);
  }

  public setContentDraggingStateState(isContentDragging: boolean): void {
    this.isContentDraggingState$.next(isContentDragging);
  }

  private correctScrollLeftByTargetTab(tabName: T): void {
    const targetElement: HTMLElement = this.tabNameToHtmlElementMap.get(JSON.stringify(tabName));

    combineLatest([this.hostElement$.pipe(filterNotNil()), this.scrollable$.pipe(filterNotNil())])
      .pipe(
        take(1),
        map(([hostElement, scrollable]: [HTMLElement, ScrollableComponent]) => {
          const hostClientRect: ClientRect = hostElement.getBoundingClientRect();
          const targetClientRect: ClientRect = targetElement.getBoundingClientRect();

          const leftOffsetPx: number = targetClientRect.left - hostClientRect.left;
          const rightOffsetPx: number = hostClientRect.right - targetClientRect.right;
          const centerLeftDeltaPx: number = (hostClientRect.width - targetClientRect.width) / 2;
          return [leftOffsetPx, rightOffsetPx, scrollable, centerLeftDeltaPx];
        })
      )
      .subscribe(
        ([leftOffsetPx, rightOffsetPx, scrollable, centerLeftDeltaPx]: [
          number,
          number,
          ScrollableComponent,
          number
        ]) => {
          const isNeedScrollToLeft: boolean = leftOffsetPx < rightOffsetPx;
          const isNeedScrollToRight: boolean = rightOffsetPx < leftOffsetPx;

          const isSmoothScroll: boolean = true;

          if (isNeedScrollToLeft) {
            scrollable.setScrollLeftByDelta(Math.ceil(-centerLeftDeltaPx + leftOffsetPx), isSmoothScroll);
            return;
          }

          if (isNeedScrollToRight) {
            scrollable.setScrollLeftByDelta(Math.ceil(-rightOffsetPx + centerLeftDeltaPx), isSmoothScroll);
            return;
          }
        }
      );
  }
}

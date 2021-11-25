import { filterNotNil, isEmpty, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { asyncScheduler, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, observeOn, subscribeOn, take } from 'rxjs/operators';
import { ScrollableComponent } from '../../../../lib/components/scrollable/components/scrollable/scrollable.component';

export abstract class TabsServiceBase {
  protected readonly tabNameToHtmlElementMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
  private readonly activeTabNameState$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);
  public readonly activeTabName$: Observable<Nullable<string>> = this.activeTabNameState$.asObservable();

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
    map((activeTabName: string) => this.tabNameToHtmlElementMap.get(activeTabName)),
    shareReplayWithRefCount()
  );

  public readonly railHighlighterOffsetLeftPx$: Observable<number> = combineLatest([
    this.activeHtmlElement$.pipe(filterNotNil()),
    this.tabsHtmlElement$.pipe(filterNotNil())
  ]).pipe(
    observeOn(asyncScheduler),
    map(([activeHtmlElement, tabsHtmlElement]: [HTMLElement, HTMLElement]) => {
      const activeClientRect: ClientRect = activeHtmlElement.getBoundingClientRect();
      const tabsClientRect: ClientRect = tabsHtmlElement.getBoundingClientRect();
      return activeClientRect.left - tabsClientRect.left;
    })
  );
  public readonly railHighlighterWidthPx$: Observable<number> = this.activeHtmlElement$.pipe(
    map((activeHtmlElement: HTMLElement) => activeHtmlElement.clientWidth)
  );

  private readonly tabNames: string[] = [];

  public registerTab(tabName: string): void {
    this.tabNames.push(tabName);
  }

  public setInitialTab(): void {
    this.activeTabName$
      .pipe(
        take(1),
        filter((activeTab: Nullable<string>) => isNil(activeTab) && !isEmpty(this.tabNames)),
        subscribeOn(asyncScheduler)
      )
      .subscribe(() => {
        this.setActiveTab(this.tabNames[0]);
      });
  }

  public setActiveTab(tabName: string): void {
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

  public registerTabHtmlElement(tabName: string, htmlElement: HTMLElement): void {
    this.tabNameToHtmlElementMap.set(tabName, htmlElement);
  }

  private correctScrollLeftByTargetTab(tabName: string): void {
    const targetElement: HTMLElement = this.tabNameToHtmlElementMap.get(tabName);

    combineLatest([this.hostElement$.pipe(filterNotNil()), this.scrollable$.pipe(filterNotNil())])
      .pipe(
        take(1),
        map(([hostElement, scrollable]: [HTMLElement, ScrollableComponent]) => {
          const hostClientRect: ClientRect = hostElement.getBoundingClientRect();
          const targetClientRect: ClientRect = targetElement.getBoundingClientRect();

          const leftOffsetPx: number = targetClientRect.left - hostClientRect.left;
          const rightOffsetPx: number = hostClientRect.right - targetClientRect.right;

          return [leftOffsetPx, rightOffsetPx, scrollable];
        })
      )
      .subscribe(([leftOffsetPx, rightOffsetPx, scrollable]: [number, number, ScrollableComponent]) => {
        if (leftOffsetPx > 0 && rightOffsetPx > 0) {
          return;
        }

        const isNeedScrollToLeft: boolean = leftOffsetPx < rightOffsetPx;
        const isNeedScrollToRight: boolean = rightOffsetPx < leftOffsetPx;

        if (isNeedScrollToLeft) {
          scrollable.setScrollLeftByDelta(Math.ceil(leftOffsetPx));
        }

        if (isNeedScrollToRight) {
          scrollable.setScrollLeftByDelta(Math.ceil(-rightOffsetPx));
        }
      });
  }
}

import { Injectable } from '@angular/core';
import { TabsServiceBase } from '../../../../internal/declarations/classes/abstract/tabs-service-base.abstract';
import { asyncScheduler, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, observeOn, take } from 'rxjs/operators';
import { filterNotNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { ScrollableComponent } from '../../scrollable/components/scrollable/scrollable.component';

@Injectable()
export class TabsStateService extends TabsServiceBase {
  private readonly tabNameToHtmlElementMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
  private readonly activeHtmlElement$: Observable<HTMLElement> = this.activeTabName$.pipe(
    filterNotNil(),
    map((activeTabName: string) => this.tabNameToHtmlElementMap.get(activeTabName)),
    shareReplayWithRefCount()
  );
  private readonly hostElement$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<Nullable<HTMLElement>>(
    null
  );
  private readonly scrollable$: BehaviorSubject<Nullable<ScrollableComponent>> = new BehaviorSubject<
    Nullable<ScrollableComponent>
  >(null);
  private readonly tabsHtmlElement$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<
    Nullable<HTMLElement>
  >(null);

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

  public setActiveTab(tabName: string): void {
    super.setActiveTab(tabName);
    this.correctScrollLeftByTargetTab(tabName);
  }

  public registerTabsHtmlElement(htmlElement: HTMLElement): void {
    this.tabsHtmlElement$.next(htmlElement);
  }

  public registerHostHtmlElement(htmlElement: HTMLElement): void {
    this.hostElement$.next(htmlElement);
  }

  public refisterScrollable(scrollable: ScrollableComponent): void {
    this.scrollable$.next(scrollable);
  }

  public registerTabHtmlElement(tabName: string, htmlElement: HTMLElement): void {
    this.tabNameToHtmlElementMap.set(tabName, htmlElement);
  }

  private correctScrollLeftByTargetTab(tabName: string): void {
    const targetElement: HTMLElement = this.tabNameToHtmlElementMap.get(tabName);

    combineLatest([this.hostElement$.pipe(filterNotNil()), this.scrollable$.pipe(filterNotNil())])
      .pipe(take(1))
      .subscribe(([hostElement, scrollable]: [HTMLElement, ScrollableComponent]) => {
        const hostClientRect: ClientRect = hostElement.getBoundingClientRect();
        const targetClientRect: ClientRect = targetElement.getBoundingClientRect();

        const leftOffsetPx: number = targetClientRect.left - hostClientRect.left;
        const rightOffsetPx: number = hostClientRect.right - targetClientRect.right;

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

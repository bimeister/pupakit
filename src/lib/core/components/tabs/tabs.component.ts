import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { NavigationEnd, Router, RouterEvent, UrlTree } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, map, startWith, switchMap, take } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

export interface Tab {
  name: string;
  iconName?: string;
  iconSrc?: string;
  route?: string;
  urlTree?: UrlTree;
}

@Component({
  selector: 'pupa-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnDestroy, AfterViewInit {
  @ViewChild('highlighterElement', { static: true }) private readonly highlighterElementRef: ElementRef<HTMLDivElement>;
  @ViewChild('tabsElement', { static: false }) private readonly tabsElementRef: ElementRef<HTMLDivElement>;
  @ViewChildren('tabsItemElement') private readonly tabsItemsRef: QueryList<ElementRef<HTMLButtonElement>>;

  @Input() public set tabs(newValue: Tab[]) {
    if (!Array.isArray(newValue)) {
      return;
    }
    this.tabs$.next(newValue);
  }

  public readonly tabs$: BehaviorSubject<Tab[]> = new BehaviorSubject<Tab[]>([]);

  private readonly sortedTabsRoutes$: Observable<string[]> = this.tabs$.pipe(
    map((tabs: Tab[]) => this.sortTabsByRouteLengthDescendingly(tabs)),
    map((tabs: Tab[]) => tabs.map((tab: Tab) => (tab && tab.route ? tab.route.toLowerCase() : ''))),
    distinctUntilKeyChanged('length')
  );

  private get currentUrl(): string {
    const wholeUrl: string = window.location.href;
    const host: string = window.location.host;
    const protocol: string = `${window.location.protocol}//`;
    return wholeUrl
      .replace(host, '')
      .replace(protocol, '')
      .toLowerCase();
  }

  private readonly routerNavigationEnded$: Observable<void> = this.router.events.pipe(
    startWith(new NavigationEnd(null, null, this.currentUrl)),
    filter((routerEvent: RouterEvent) => routerEvent instanceof NavigationEnd),
    distinctUntilKeyChanged('url'),
    map(() => undefined)
  );

  private readonly activeUrl$: Observable<string> = this.routerNavigationEnded$.pipe(
    map(() => this.currentUrl),
    distinctUntilChanged()
  );

  public readonly selectedTabIndex$: Observable<number> = this.activeUrl$.pipe(
    switchMap((currentUrl: string) => {
      return this.sortedTabsRoutes$.pipe(
        map((tabRoutes: string[]) => {
          const targetTabIndexSorted: number = this.getSelectedTabIndex(currentUrl, tabRoutes);
          return tabRoutes[targetTabIndexSorted];
        }),
        filter((tabRoute: string) => !isNullOrUndefined(tabRoute)),
        map((tabRoute: string) => tabRoute.toLowerCase()),
        switchMap((selectedTabRoute: string) =>
          this.tabs$.pipe(
            map((tabs: Tab[]) => {
              return tabs.findIndex((tab: Tab) => tab && tab.route && tab.route.toLowerCase() === selectedTabRoute);
            })
          )
        )
      );
    }),
    distinctUntilChanged()
  );

  private readonly selectedTabElement$: Observable<HTMLElement> = this.selectedTabIndex$.pipe(
    map((tabIndex: number) => this.tabsItemsRef.toArray()[tabIndex]),
    filter((selectedTabElement: ElementRef<HTMLElement>) => !isNullOrUndefined(selectedTabElement)),
    map((selectedTabElement: ElementRef<HTMLElement>) => selectedTabElement.nativeElement)
  );

  private readonly resizeEvent$: Observable<Event> = fromEvent(window, 'resize');

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly renderer: Renderer2, private readonly router: Router) {}

  public ngAfterViewInit(): void {
    this.rerenderHighlighterOnSelectedElementChange();
    this.rerenderHighlighterOnResizeEvent();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public selectTab(tab: Tab, clickEvent?: MouseEvent): void {
    if (!isNullOrUndefined(clickEvent)) {
      clickEvent.stopPropagation();
    }
    this.tabs$
      .pipe(
        take(1),
        filter((tabs: Tab[]) => !isNullOrUndefined(tabs)),
        filter((tabs: Tab[]) => tabs.some((tabInner: Tab) => tab.route === tabInner.route))
      )
      .subscribe(() => this.router.navigateByUrl(tab.route));
  }

  private rerenderHighlighterOnSelectedElementChange(): void {
    this.subscription.add(this.selectedTabElement$.subscribe((element: Element) => this.highlightTabElement(element)));
  }

  private rerenderHighlighterOnResizeEvent(): void {
    const elementToHighlight$: Observable<Element> = this.resizeEvent$.pipe(
      switchMap(() => this.selectedTabElement$.pipe(take(1)))
    );
    this.subscription.add(elementToHighlight$.subscribe((element: Element) => this.highlightTabElement(element)));
  }

  private highlightTabElement(selectedTabElement: Element): void {
    if (
      isNullOrUndefined(this.tabsElementRef) ||
      isNullOrUndefined(this.highlighterElementRef) ||
      isNullOrUndefined(selectedTabElement)
    ) {
      return;
    }
    const highlighter: HTMLDivElement = this.highlighterElementRef.nativeElement;
    const selectedTabClientRect: DOMRect | ClientRect = selectedTabElement.getBoundingClientRect();

    const selectedTabLeftOffsetPx: number = selectedTabClientRect.left;
    const selectedTabWidthPx: number = selectedTabClientRect.width;
    const tabsContainerLeftOffsetPx: number = this.tabsElementRef.nativeElement.getBoundingClientRect().left;
    this.renderer.setStyle(highlighter, 'left', `${selectedTabLeftOffsetPx - tabsContainerLeftOffsetPx}px`);
    this.renderer.setStyle(highlighter, 'width', `${selectedTabWidthPx}px`);
  }

  private readonly getSelectedTabIndex = (currentUrl: string, tabRoutes: string[]): number => {
    const fullOccuranceIndex: number = tabRoutes.indexOf(currentUrl);
    if (!Object.is(fullOccuranceIndex, -1)) {
      return fullOccuranceIndex;
    }
    const urlWithoutParams: string = this.getUrlStringWithoutParams(currentUrl);
    return tabRoutes.findIndex((tabRoute: string) => urlWithoutParams.startsWith(tabRoute.toLowerCase()));
  };

  private readonly getUrlStringWithoutParams = (url: string): string => {
    const indexOfQueryParamsStart: number = url.indexOf('?');
    if (Object.is(indexOfQueryParamsStart, -1)) {
      return url.toLowerCase();
    }
    return url.toLowerCase().substring(0, indexOfQueryParamsStart);
  };

  private readonly sortTabsByRouteLengthDescendingly = (tabs: Tab[]): Tab[] => {
    if (!Array.isArray(tabs) || Object.is(tabs.length, 0)) {
      return [];
    }
    if (tabs.some((tab: Tab) => isNullOrUndefined(tab.route))) {
      return tabs;
    }
    return [...tabs]
      .sort((tab1: Tab, tab2: Tab): -1 | 0 | 1 => {
        const tab1RouteLength: number = tab1.route.length;
        const tab2RouteLength: number = tab2.route.length;
        if (tab1RouteLength > tab2RouteLength) {
          return 1;
        }
        if (tab1RouteLength < tab2RouteLength) {
          return -1;
        }
        return 0;
      })
      .reverse();
  };
}

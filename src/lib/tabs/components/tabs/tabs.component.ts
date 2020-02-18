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
import { NavigationEnd, Params, Router, RouterEvent } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, map, startWith, switchMap, take } from 'rxjs/operators';

import { isNullOrUndefined, Tab } from '../../../../internal';

interface TabWithUrl extends Tab {
  url: string;
}

type Primitive = string | number | boolean | symbol;

type ObjectEntry<K = Primitive, V = any> = [K, V];

enum ObjectEntryData {
  Key,
  Value
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
    if (Object.is(newValue.length, 0)) {
      this.tabs$.next([]);
      return;
    }
    const tabsWithUrl: TabWithUrl[] = newValue
      .filter((tab: Tab) => !isNullOrUndefined(tab))
      .map((tab: Tab) => this.getTabWithUrl(tab));
    this.tabs$.next(tabsWithUrl);
  }

  @Input() public refreshSubject$?: Observable<void>;

  public readonly tabs$: BehaviorSubject<TabWithUrl[]> = new BehaviorSubject<TabWithUrl[]>([]);

  private readonly sortedTabsUrls$: Observable<string[]> = this.tabs$.pipe(
    map((tabs: TabWithUrl[]) => this.sortTabsByUrlLengthDescendingly(tabs)),
    map((tabs: TabWithUrl[]) => tabs.map((tab: TabWithUrl) => tab.url)),
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
    startWith(new NavigationEnd(null, null, this.getCurrentUrlWithQueryParams())),
    filter((routerEvent: RouterEvent) => routerEvent instanceof NavigationEnd),
    distinctUntilKeyChanged('url'),
    map(() => undefined)
  );

  private readonly activeUrl$: Observable<string> = this.routerNavigationEnded$.pipe(
    map(() => this.getCurrentUrlWithQueryParams()),
    distinctUntilChanged()
  );

  public readonly selectedTabIndex$: Observable<number> = this.activeUrl$.pipe(
    switchMap((currentUrlWithParams: string) => {
      return this.sortedTabsUrls$.pipe(
        map((sortedTabUrls: string[]) => {
          const targetTabIndexSorted: number = this.getSelectedTabIndex(currentUrlWithParams, sortedTabUrls);
          return sortedTabUrls[targetTabIndexSorted];
        }),
        filter((tabUrl: string) => !isNullOrUndefined(tabUrl)),
        switchMap((selectedTabUrl: string) =>
          this.tabs$.pipe(
            map((tabs: TabWithUrl[]) => {
              return tabs.findIndex((tab: TabWithUrl) => tab.url === selectedTabUrl);
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
    this.subscribeOnRefreshEvent();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public selectTab(clickedTab: TabWithUrl, clickEvent?: MouseEvent): void {
    if (!isNullOrUndefined(clickEvent)) {
      clickEvent.stopPropagation();
    }
    this.tabs$
      .pipe(
        take(1),
        filter((tabs: TabWithUrl[]) => Array.isArray(tabs)),
        filter((tabs: TabWithUrl[]) => tabs.some((tab: TabWithUrl) => clickedTab.url === tab.url))
      )
      .subscribe(() => {
        const needQueryParamsRemoval: boolean = clickedTab.removeExistingQueryParams;
        if (needQueryParamsRemoval) {
          this.router.navigateByUrl(clickedTab.route);
          return;
        }

        this.router.navigate([clickedTab.route], {
          queryParams: isNullOrUndefined(clickedTab.queryParams) ? {} : clickedTab.queryParams,
          queryParamsHandling: 'merge'
        });
      });
  }

  private subscribeOnRefreshEvent(): void {
    if (isNullOrUndefined(this.refreshSubject$)) {
      return;
    }

    this.subscription.add(this.refreshSubject$.subscribe(() => this.refreshHighlightedElement()));
  }

  private refreshHighlightedElement(): void {
    this.selectedTabElement$
      .pipe(
        take(1),
        filter((element: Element) => !isNullOrUndefined(element))
      )
      .subscribe((element: Element) => this.highlightTabElement(element));
  }

  private getCurrentUrlWithQueryParams(): string {
    const queryParamsString: string = window.location.search;
    const queryParamsObject: Params = this.getParamsFromRouteString(queryParamsString);
    const queryParamsObjectEntries: ObjectEntry<string, string>[] = this.getSortedQueryParamsEntries(queryParamsObject);
    const sortedQueryParamsString: string = this.getStringifiedQueryParams(queryParamsObjectEntries);
    return `${this.getUrlStringWithoutParams(this.currentUrl)}?${sortedQueryParamsString}`;
  }

  private rerenderHighlighterOnSelectedElementChange(): void {
    this.subscription.add(
      this.selectedTabElement$.subscribe((element: Element) => {
        this.highlightTabElement(element);
      })
    );
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

  private getTabWithUrl(tab: Tab): TabWithUrl {
    const paramsFromRoute: Params = this.getParamsFromRouteString(tab.route);
    const routeWithoutParams: string = this.getUrlStringWithoutParams(tab.route).toLowerCase();

    if (isNullOrUndefined(tab.queryParams) && isNullOrUndefined(paramsFromRoute)) {
      return { ...tab, route: routeWithoutParams, url: routeWithoutParams, queryParams: {} };
    }
    const queryParamsEntries: ObjectEntry<string, string>[] = this.getSortedQueryParamsEntries({
      ...tab.queryParams,
      ...paramsFromRoute
    });

    const queryParamsString: string = this.getStringifiedQueryParams(queryParamsEntries);

    const noQueryParamsDefined: boolean = Object.is(queryParamsString.length, 0);
    if (noQueryParamsDefined) {
      return { ...tab, route: routeWithoutParams, url: routeWithoutParams, queryParams: {} };
    }

    return {
      ...tab,
      route: routeWithoutParams,
      queryParams: Object.fromEntries(queryParamsEntries),
      url: String(`${routeWithoutParams}?${queryParamsString}`).toLowerCase()
    };
  }

  private getParamsFromRouteString(route: string): Params {
    const indexOfParamsSeparator: number = route.indexOf('?');
    const noParamsInRoute: boolean = Object.is(indexOfParamsSeparator, -1);

    if (noParamsInRoute) {
      return {};
    }

    const routeParamsEntries: ObjectEntry<string, string>[] = route
      .substring(indexOfParamsSeparator + 1)
      .split('&')
      .map((singleParam: string) => singleParam.split('='))
      .filter((singleParamEntry: string[]) => {
        const validTurpleLength: number = 2;
        return Object.is(singleParamEntry.length, validTurpleLength);
      }) as [string, string][];

    return Object.fromEntries(routeParamsEntries);
  }

  private getUrlStringWithoutParams(url: string): string {
    const indexOfQueryParamsStart: number = url.indexOf('?');
    if (Object.is(indexOfQueryParamsStart, -1)) {
      return url.toLowerCase();
    }
    return url.toLowerCase().substring(0, indexOfQueryParamsStart);
  }

  private getSortedQueryParamsEntries(params: Params): ObjectEntry<string, string>[] {
    return Object.entries<string>(params).sort(
      (queryParamsEntry1: ObjectEntry<string, string>, queryParamsEntry2: ObjectEntry<string, string>) => {
        const queryParamsEntry1Name: string = queryParamsEntry1[ObjectEntryData.Key];
        const queryParamsEntry2Name: string = queryParamsEntry2[ObjectEntryData.Key];
        if (queryParamsEntry1Name > queryParamsEntry2Name) {
          return 1;
        }
        if (queryParamsEntry1Name < queryParamsEntry2Name) {
          return -1;
        }
        return 0;
      }
    );
  }

  private getStringifiedQueryParams(paramsEntries: ObjectEntry<string, string>[]): string {
    return paramsEntries
      .map(
        (queryParamsEntry: ObjectEntry<string, string>) =>
          `${queryParamsEntry[ObjectEntryData.Key]}=${queryParamsEntry[ObjectEntryData.Value]}`
      )
      .join('&');
  }

  private readonly getSelectedTabIndex = (currentUrlWithParams: string, tabUrls: string[]): number => {
    const fullOccuranceIndex: number = tabUrls.indexOf(currentUrlWithParams);
    if (!Object.is(fullOccuranceIndex, -1)) {
      return fullOccuranceIndex;
    }

    const urlWithParamsEntryOccuranceIndex: number = tabUrls.findIndex((tabUrl: string) =>
      currentUrlWithParams.startsWith(tabUrl.toLowerCase())
    );
    if (!Object.is(urlWithParamsEntryOccuranceIndex, -1)) {
      return urlWithParamsEntryOccuranceIndex;
    }

    const closestParamsOccuranceIndex: number = this.getClosestParamsOccuranceIndex(currentUrlWithParams, tabUrls);
    if (!Object.is(closestParamsOccuranceIndex, -1)) {
      return closestParamsOccuranceIndex;
    }

    const currentUrlWithoutParams: string = this.getUrlStringWithoutParams(currentUrlWithParams);
    return tabUrls.findIndex((tabUrl: string) => currentUrlWithoutParams.startsWith(tabUrl.toLowerCase()));
  };

  private readonly getClosestParamsOccuranceIndex = (currentUrlWithParams: string, tabUrls: string[]): number => {
    const paramsStartIndex: number = currentUrlWithParams.indexOf('?');
    const currentUrlStringifiedParams: string[] = currentUrlWithParams.substring(paramsStartIndex + 1).split('&');
    const tabUrlsParams: string[][] = tabUrls.map((tabUrl: string) => {
      const tabParamsStartIndex: number = tabUrl.indexOf('?');
      return tabUrl.substring(tabParamsStartIndex + 1).split('&');
    });
    const occurances: number[] = tabUrlsParams.map((stringifiedParams: string[]) => {
      const occurancesCount: number = stringifiedParams
        .map((stringifiedParam: string) => currentUrlStringifiedParams.includes(stringifiedParam))
        .filter((isOccurance: boolean) => isOccurance).length;
      return occurancesCount;
    });
    const biggestOccurance: number = [...occurances].sort((value1: number, value2: number): -1 | 0 | 1 => {
      if (value1 < value2) {
        return 1;
      }
      if (value1 > value2) {
        return -1;
      }
      return 0;
    })[0];
    return occurances.indexOf(biggestOccurance);
  };

  private readonly sortTabsByUrlLengthDescendingly = (tabs: TabWithUrl[]): TabWithUrl[] => {
    if (!Array.isArray(tabs) || Object.is(tabs.length, 0)) {
      return [];
    }

    return [...tabs].sort((tab1: TabWithUrl, tab2: TabWithUrl): -1 | 0 | 1 => {
      const tab1UrlLength: number = tab1.url.length;
      const tab2UrlLength: number = tab2.url.length;
      if (tab1UrlLength < tab2UrlLength) {
        return 1;
      }
      if (tab1UrlLength > tab2UrlLength) {
        return -1;
      }
      return 0;
    });
  };
}

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
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { delay, filter, first, map } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../helpers/is-null-or-undefined.helper';

export interface Tab {
  name: string;
  iconName?: string;
  iconSrc?: string;
  route?: string;
}

@Component({
  selector: 'pupa-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnDestroy, AfterViewInit {
  @ViewChild('highlighterElement', { static: true }) public readonly highlighterElementRef: ElementRef<HTMLDivElement>;
  @ViewChild('tabsElement', { static: false }) public readonly tabsElementRef: ElementRef<HTMLDivElement>;
  @ViewChildren('tabElement') public readonly tabElements: QueryList<ElementRef<HTMLButtonElement>>;

  public readonly tabs$: BehaviorSubject<Tab[]> = new BehaviorSubject([]);
  @Input() public set tabs(value: Tab[]) {
    this.tabs$.next(value);
  }

  private readonly initialUrl$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public readonly activeUrl$: Observable<string> = merge(
    this.initialUrl$,
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects)
    )
  );

  public readonly selectedTabIndex$: Observable<number> = combineLatest([this.tabs$, this.activeUrl$]).pipe(
    map(([tabs, url]: [Tab[], string]) => {
      const regex: RegExp = new RegExp(`^${url}`);
      return tabs.findIndex((tab: Tab) => regex.test(tab.route) || tab.route === url);
    })
  );

  public readonly selectedTabElement$: Observable<HTMLElement> = this.selectedTabIndex$.pipe(
    delay(0),
    map(
      (tabIndex: number): HTMLElement => {
        const elementRef: ElementRef<HTMLButtonElement> = this.tabElements.toArray()[tabIndex];
        return elementRef ? elementRef.nativeElement : null;
      }
    )
  );

  private readonly resize$: Observable<unknown> = merge(fromEvent(window, 'resize'), this.initialUrl$);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly renderer: Renderer2, private readonly router: Router) {}

  public ngAfterViewInit(): void {
    this.subscription.add(
      combineLatest([this.selectedTabElement$, this.resize$]).subscribe(([selectedTabElement, _]: [Element, unknown]) =>
        this.highlightTabElement(selectedTabElement)
      )
    );
    this.initialUrl$.next(this.router.url);
  }

  public selectTab(tab: Tab, clickEvent?: MouseEvent): void {
    if (!isNullOrUndefined(clickEvent)) {
      clickEvent.stopPropagation();
    }
    this.tabs$
      .pipe(
        first(),
        filter((tabs: Tab[]) => !isNullOrUndefined(tabs)),
        filter((tabs: Tab[]) => tabs.some((tabInner: Tab) => tab.route === tabInner.route))
      )
      .subscribe(() => {
        this.router.navigateByUrl(tab.route);
      });
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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

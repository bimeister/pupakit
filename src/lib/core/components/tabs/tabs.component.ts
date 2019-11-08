import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { BehaviorSubject, combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, filter, map } from 'rxjs/operators';

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
  private readonly sub: Subscription = new Subscription();
  @ViewChild('highlighterElement', { static: true }) public readonly highlighterElementRef: ElementRef<HTMLDivElement>;
  @ViewChild('tabsElement', { static: false }) public readonly tabsElementRef: ElementRef<HTMLDivElement>;
  @ViewChildren('tabElement') public readonly tabElements: QueryList<ElementRef<HTMLButtonElement>>;

  public readonly tabs$: BehaviorSubject<Tab[]> = new BehaviorSubject([]);
  @Input() public set tabs(value: Tab[]) {
    this.tabs$.next(value);
  }

  @Input() public set selectedTabName(tabName: string) {
    this.selectedTabName$.next(tabName);
  }

  @Output() public selectedTabNameChange: EventEmitter<string> = new EventEmitter<string>();

  public activeUrl$: Observable<string> = this.router.events.pipe(
    filter((event: RouterEvent) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.urlAfterRedirects)
  );

  public selectedTabIndex$: Observable<number> = combineLatest([this.tabs$, this.activeUrl$]).pipe(
    map(([tabs, url]: [Tab[], string]) => {
      return tabs.findIndex((tab: Tab) => tab.route === url);
    })
  );

  public readonly selectedTabName$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private readonly selectedTabElement$: Observable<HTMLElement> = this.selectedTabIndex$.pipe(
    delay(0),
    map(
      (tabIndex: number): HTMLElement => {
        const elementRef: ElementRef<HTMLButtonElement> = this.tabElements.toArray()[tabIndex];
        return elementRef ? elementRef.nativeElement : null;
      }
    ),
    filter((selectedTab: HTMLElement) => !isNullOrUndefined(selectedTab))
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly renderer: Renderer2, private readonly router: Router) {
    this.appendHighligterToSelectedTab();
    this.emitNewTabNameOnChange();
  }

  public ngAfterViewInit(): void {
    this.sub.add(
      combineLatest([this.selectedTabElement$, fromEvent(window, 'resize')]).subscribe(
        ([selectedTabElement, _]: [Element, Event]) => this.highlightTabElement(selectedTabElement)
      )
    );
  }

  public selectTab(tab: Tab, clickEvent?: MouseEvent): void {
    if (!isNullOrUndefined(clickEvent)) {
      clickEvent.stopPropagation();
    }
    this.selectedTabName$.next(tab.name);
    if (isNullOrUndefined(tab.route)) {
      return;
    }
    this.router.navigateByUrl(tab.route);
  }

  private appendHighligterToSelectedTab(): void {
    const selectedTabElement$: Observable<Element> = this.selectedTabElement$;
    this.subscription.add(
      selectedTabElement$.subscribe((selectedTabElement: Element) => this.highlightTabElement(selectedTabElement))
    );
  }

  private emitNewTabNameOnChange(): void {
    this.subscription.add(
      this.selectedTabName$
        .pipe(distinctUntilChanged())
        .subscribe((tabName: string) => this.selectedTabNameChange.emit(tabName))
    );
  }

  private highlightTabElement(selectedTabElement: Element): void {
    if (!this.tabsElementRef) {
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
    this.sub.unsubscribe();
  }
}

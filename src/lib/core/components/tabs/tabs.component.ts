import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

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
export class TabsComponent implements AfterViewInit {
  @ViewChild('highlighterElement', { static: true }) public readonly highlighterElementRef: ElementRef<HTMLDivElement>;
  @ViewChild('tabsElement', { static: true }) public readonly tabsElementRef: ElementRef<HTMLDivElement>;

  @Input() public tabs: Tab[] = [];

  @Input() public set selectedTabName(tabName: string) {
    this.selectedTabName$.next(tabName);
  }

  @Output() public selectedTabNameChange: EventEmitter<string> = new EventEmitter<string>();

  public readonly selectedTabName$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly renderer: Renderer2, private readonly router: Router) {
    this.appendHighligterToSelectedTab();
  }

  public ngAfterViewInit(): void {
    if (!isNullOrUndefined(this.selectedTabName)) {
      return;
    }
    this.selectTab(this.tabs[0]);
  }

  public selectTab(tab: Tab, clickEvent?: MouseEvent): void {
    if (!isNullOrUndefined(clickEvent)) {
      clickEvent.stopPropagation();
    }
    this.selectedTabName$.next(tab.name);
    this.selectedTabNameChange.emit(tab.name);
    if (isNullOrUndefined(tab.route)) {
      return;
    }
    this.router.navigateByUrl(tab.route);
  }

  private appendHighligterToSelectedTab(): void {
    const selectedTabElement$: Observable<Element> = this.selectedTabName$.pipe(
      distinctUntilChanged(),
      map((tabName: string) => this.tabs.map((tab: Tab) => tab.name).indexOf(tabName)),
      filter((tabIndex: number) => !Object.is(tabIndex, -1)),
      map((tabIndex: number) => this.tabsElementRef.nativeElement.children.item(tabIndex)),
      filter((selectedTab: Element) => !isNullOrUndefined(selectedTab))
    );
    this.subscription.add(
      selectedTabElement$.subscribe((selectedTabElement: Element) => {
        const highlighter: HTMLDivElement = this.highlighterElementRef.nativeElement;
        const selectedTabClientRect: DOMRect | ClientRect = selectedTabElement.getBoundingClientRect();

        const selectedTabLeftOffsetPx: number = selectedTabClientRect.left;
        const selectedTabWidthPx: number = selectedTabClientRect.width;
        const tabsContainerLeftOffsetPx: number = this.tabsElementRef.nativeElement.getBoundingClientRect().left;
        this.renderer.setStyle(highlighter, 'left', `${selectedTabLeftOffsetPx - tabsContainerLeftOffsetPx}px`);
        this.renderer.setStyle(highlighter, 'width', `${selectedTabWidthPx}px`);
      })
    );
  }
}

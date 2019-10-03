import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export interface Tab {
  name: string;
  iconName?: string;
  iconSrc?: string;
}

@Component({
  selector: 'pupa-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  @ViewChild('highlighterElement', { static: true }) public readonly highlighterElementRef: ElementRef<HTMLDivElement>;
  @ViewChild('tabsElement', { static: true }) public readonly tabsElementRef: ElementRef<HTMLDivElement>;

  @Input() public tabs: Tab[] = [];

  @Input() public set selectedTabName(tabName: string) {
    this.selectedTabName$.next(tabName);
  }

  @Output() public selectedTabNameChange: EventEmitter<string> = new EventEmitter<string>();

  public readonly selectedTabName$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly renderer: Renderer2) {
    this.appendHighligterToSelectedTab();
  }

  public selectTab(tabName: string, clickEvent: MouseEvent): void {
    clickEvent.stopPropagation();
    this.selectedTabName$.next(tabName);
    this.selectedTabNameChange.emit(tabName);
  }

  private appendHighligterToSelectedTab(): void {
    const selectedTabElement$: Observable<Element> = this.selectedTabName$.pipe(
      distinctUntilChanged(),
      map((tabName: string) => this.tabs.map((tab: Tab) => tab.name).indexOf(tabName)),
      filter((tabIndex: number) => !Object.is(tabIndex, -1)),
      map((tabIndex: number) => this.tabsElementRef.nativeElement.children.item(tabIndex))
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

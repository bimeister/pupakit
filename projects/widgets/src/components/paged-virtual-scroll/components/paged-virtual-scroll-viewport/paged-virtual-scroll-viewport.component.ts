import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  PagedVirtualScrollArguments,
  ComponentChanges,
  ComponentChange,
  ClientUiStateHandlerService,
} from '@bimeister/pupakit.common';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { VirtualScrollViewportComponent } from '../../../../declarations/types/virtual-scroll-viewport-component.type';
import { PagedVirtualScrollStateService } from '../../services/paged-virtual-scroll-state.service';

const DEBOUNCE_TIME_MS: number = 500;

@Component({
  selector: 'pupa-paged-virtual-scroll-viewport',
  templateUrl: './paged-virtual-scroll-viewport.component.html',
  styleUrls: ['./paged-virtual-scroll-viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [PagedVirtualScrollStateService],
})
export class PagedVirtualScrollViewportComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  @Input() public itemSize: number;
  private readonly itemSize$: BehaviorSubject<number> = new BehaviorSubject<number>(10);

  public readonly itemSizePx$: BehaviorSubject<number> = this.pagedVirtualScrollStateService.itemSize$;

  @Input() public totalCount: number;
  public readonly totalCount$: BehaviorSubject<number> = this.pagedVirtualScrollStateService.totalCount$;

  private readonly viewportSize$: BehaviorSubject<ClientRect> = this.pagedVirtualScrollStateService.viewportSize$;

  private readonly pagedVirtualScrollArgumentsToOutput$: Subject<PagedVirtualScrollArguments> =
    this.pagedVirtualScrollStateService.pagedVirtualScrollArgumentsToOutput$;

  public readonly firstSliceCount$: BehaviorSubject<Nullable<number>> =
    this.pagedVirtualScrollStateService.firstSliceCount$;

  @ViewChild('iframe', { static: true }) private readonly iframeElementRef: ElementRef<HTMLIFrameElement>;
  @ViewChild('cdkViewport', { static: false }) private readonly viewport: VirtualScrollViewportComponent;

  @Output()
  public changeDataSource: EventEmitter<PagedVirtualScrollArguments> = new EventEmitter<PagedVirtualScrollArguments>();

  @Output()
  public firstSliceCount: EventEmitter<number> = new EventEmitter<number>();

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService
  ) {}

  public ngOnInit(): void {
    this.subscription.add(this.handleIframeResizeEvents());
    this.subscription.add(this.handleChangeDataSourceEvent());
    this.subscription.add(this.handleChangeCountItemsInViewPort());
    this.subscription.add(this.updateItemSizePx());
  }

  public ngAfterViewInit(): void {
    this.setViewportComponent();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processItemSizeChange(changes?.itemSize);
    this.processTotalCountChange(changes?.totalCount);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public scrollToIndex(index: number = null, behavior: ScrollBehavior = 'auto'): void {
    this.pagedVirtualScrollStateService.scrollToIndex(index, behavior);
  }

  public refreshWithScrollToIndex(index: number = null, behavior: ScrollBehavior = 'auto'): void {
    this.pagedVirtualScrollStateService.refreshWithScrollToIndex(index, behavior);
  }

  public updateViewportSize(): void {
    this.viewport.checkViewportSize();
  }

  private setViewportComponent(): void {
    this.pagedVirtualScrollStateService.setViewportComponent(this.viewport);
  }

  private handleIframeResizeEvents(): Subscription {
    return fromEvent(this.iframeElementRef.nativeElement.contentWindow, 'resize')
      .pipe(startWith(new Event('resize')), debounceTime(DEBOUNCE_TIME_MS))
      .subscribe(() => {
        const viewportSize: ClientRect = this.iframeElementRef.nativeElement.getBoundingClientRect();
        this.viewportSize$.next(viewportSize);
      });
  }

  private handleChangeDataSourceEvent(): Subscription {
    return this.pagedVirtualScrollArgumentsToOutput$.subscribe(
      (pagedVirtualScrollArguments: PagedVirtualScrollArguments) =>
        this.changeDataSource.emit(pagedVirtualScrollArguments)
    );
  }

  private handleChangeCountItemsInViewPort(): Subscription {
    return this.firstSliceCount$
      .pipe(filterNotNil())
      .subscribe((firstSliceCount: number) => this.firstSliceCount.emit(firstSliceCount));
  }

  private processItemSizeChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.itemSize$.next(updatedValue);
  }

  private processTotalCountChange(change: ComponentChange<this, number>): void {
    const updatedValue: number | undefined = change?.currentValue;
    this.totalCount$.next(updatedValue);
  }

  private updateItemSizePx(): Subscription {
    return combineLatest([this.clientUiStateHandlerService.remSizePx$, this.itemSize$]).subscribe(
      ([remSizePx, itemSize]: [number, number]) => this.itemSizePx$.next(itemSize * remSizePx)
    );
  }
}

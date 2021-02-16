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
  ViewEncapsulation
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { PagedVirtualScrollArguments } from '../../../../../internal/declarations/interfaces/paged-virtual-scroll-arguments.interface';
import { VirtualScrollViewportComponent } from '../../../../../internal/declarations/interfaces/virtual-scroll-viewport-component.interface';
import { PagedVirtualScrollStateService } from '../../services/paged-virtual-scroll-state.service';

const DEBOUNCE_TIME_MS: number = 500;

@Component({
  selector: 'pupa-paged-virtual-scroll-viewport',
  templateUrl: './paged-virtual-scroll-viewport.component.html',
  styleUrls: ['./paged-virtual-scroll-viewport.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  providers: [PagedVirtualScrollStateService]
})
export class PagedVirtualScrollViewportComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
  @Input() public itemSize: number;
  public readonly itemSize$: BehaviorSubject<number> = this.pagedVirtualScrollStateService.itemSize$;

  @Input() public totalCount: number;
  public readonly totalCount$: BehaviorSubject<number> = this.pagedVirtualScrollStateService.totalCount$;

  public readonly viewportSize$: BehaviorSubject<ClientRect> = this.pagedVirtualScrollStateService.viewportSize$;

  public readonly needChangeDataSource$: Subject<PagedVirtualScrollArguments> = this.pagedVirtualScrollStateService
    .needChangeDataSource$;

  @ViewChild('iframe', { static: true }) private readonly iframeElementRef: ElementRef<HTMLIFrameElement>;
  @ViewChild('cdkViewport', { static: false }) private readonly viewport: VirtualScrollViewportComponent;

  @Output()
  public changeDataSource: EventEmitter<PagedVirtualScrollArguments> = new EventEmitter<PagedVirtualScrollArguments>();

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService) {}

  public ngOnInit(): void {
    this.subscription.add(this.handleIframeResizeEvents()).add(this.handleChangeDataSourceEvent());
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
    return this.needChangeDataSource$.subscribe((pagedVirtualScrollArguments: PagedVirtualScrollArguments) =>
      this.changeDataSource.emit(pagedVirtualScrollArguments)
    );
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

    if (isNil(updatedValue)) {
      return;
    }

    this.totalCount$.next(updatedValue);
  }
}

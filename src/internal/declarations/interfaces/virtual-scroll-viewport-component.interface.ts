import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollRepeater } from '@angular/cdk/scrolling';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface VirtualScrollViewportComponent {
  elementRef: ElementRef<HTMLElement>;

  scrolledIndexChange: Observable<number>;
  _contentWrapper: ElementRef<HTMLElement>;
  renderedRangeStream: Observable<ListRange>;

  _totalContentWidth: string;
  _totalContentHeight: string;

  attach(forOf: CdkVirtualScrollRepeater<any>): void;
  detach(): void;
  getDataLength(): number;
  getViewportSize(): number;
  getRenderedRange(): ListRange;
  setTotalContentSize(size: number): void;
  setRenderedRange(range: ListRange): void;
  getOffsetToRenderedContentStart(): number | null;
  setRenderedContentOffset(offset: number, to?: 'to-start' | 'to-end'): void;
  scrollToOffset(offset: number, behavior?: ScrollBehavior): void;
  scrollToIndex(index: number, behavior?: ScrollBehavior): void;

  measureScrollOffset(from?: 'top' | 'left' | 'right' | 'bottom' | 'start' | 'end'): number;
  measureRenderedContentSize(): number;

  measureRangeSize(range: ListRange): number;
  checkViewportSize(): void;
}

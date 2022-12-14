import { ScrollMoveDirection } from '../enums/scroll-move-direction.enum';
import { InfinityScrollerOffset } from '../interfaces/infinity-scroller-offset.interface';
import { InfinityScrollerPaginationConfig } from '../interfaces/infinity-scroller-pagination-config.interface';

export class InfinityScrollerSliceIndexesProducer {
  private startIndexState: number;
  private endIndexState: number;
  private totalCountState: number;
  private pageSizeState: number;
  private scrollMoveDirection: ScrollMoveDirection;

  public initialize(config: InfinityScrollerPaginationConfig, scrollMoveDirection: ScrollMoveDirection): void {
    const { startIndex, endIndex, pageSize } = config;

    this.startIndexState = startIndex;
    this.endIndexState = endIndex;
    this.pageSizeState = pageSize;
    this.scrollMoveDirection = scrollMoveDirection;
    this.totalCountState = 0;
  }

  public get startIndex(): number {
    return this.startIndexState;
  }

  public get endIndex(): number {
    return this.endIndexState;
  }

  public get totalCount(): number {
    return this.totalCountState;
  }

  public get pageSize(): number {
    return this.pageSizeState;
  }

  public setStartIndex(index: number): void {
    this.startIndexState = index;
  }

  public setEndIndex(index: number): void {
    this.endIndexState = index;
  }

  public setTotalCount(index: number): void {
    this.totalCountState = index;

    if (this.endIndexState > this.totalCountState) {
      this.endIndexState = this.totalCountState;
    }
  }

  public generateNextPageIndexes(): InfinityScrollerOffset {
    const startIndex: number = this.endIndexState;

    const itemsCount: number =
      this.totalCountState - this.endIndexState < this.pageSizeState
        ? this.totalCountState - this.endIndexState
        : this.pageSizeState;

    this.endIndexState =
      this.endIndexState + this.pageSizeState >= this.totalCountState
        ? this.totalCountState
        : this.endIndexState + this.pageSizeState;

    return { startIndex, itemsCount };
  }

  public generatePreviousPageIndexes(): InfinityScrollerOffset {
    const startIndex: number =
      this.pageSizeState > this.startIndexState ? 0 : this.startIndexState - this.pageSizeState;

    const itemsCount: number = this.pageSizeState > this.startIndexState ? this.startIndexState : this.pageSizeState;

    this.startIndexState = startIndex;

    return { startIndex, itemsCount };
  }

  public generateSpecificPageIndexes(scrollToIndex: number): InfinityScrollerOffset {
    const startIndex: number =
      scrollToIndex < this.pageSizeState ? 0 : Math.floor(scrollToIndex - this.pageSizeState / 2);

    const itemsCount: number = this.pageSizeState;

    this.startIndexState =
      startIndex + this.pageSizeState > this.totalCountState ? this.totalCountState - this.pageSizeState : startIndex;

    this.endIndexState = this.startIndexState + itemsCount;

    return { startIndex: this.startIndexState, itemsCount };
  }

  public getHtmlElementIndex(itemIndex: number): number {
    const htmlElementIndex: number =
      this.scrollMoveDirection === ScrollMoveDirection.FromBottomToTop
        ? this.endIndexState - itemIndex - 1
        : itemIndex - this.startIndexState;

    return htmlElementIndex;
  }

  public isOnBottom(): boolean {
    return this.endIndexState === this.totalCountState;
  }

  public isOnTop(): boolean {
    return this.startIndexState === 0;
  }

  public isIndexInCurrentSlice(indexToCheck: number): boolean {
    return indexToCheck >= this.startIndexState && indexToCheck < this.endIndexState;
  }
}

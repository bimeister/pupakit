import { ListRange } from '@angular/cdk/collections';

export interface HugeTreeState {
  range: ListRange;
  expandedItemIds: string[];
  currentIndex: number;
  totalCount: number;
  currentTreeItemsLength: number;
}

import { ComponentChange } from './component-change.interface';

export interface MinHeightUnitChanges<C = any> {
  minHeight?: ComponentChange<C>;
  minHeightPx?: ComponentChange<C>;
  minHeightVw?: ComponentChange<C>;
  minHeightVh?: ComponentChange<C>;
  minHeightRem?: ComponentChange<C>;
  minHeightPercents?: ComponentChange<C>;
}

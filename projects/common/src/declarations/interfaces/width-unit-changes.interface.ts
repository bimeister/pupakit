import { type ComponentChange } from './component-change.interface';

export interface WidthUnitChanges<C = any> {
  width?: ComponentChange<C>;
  widthPx?: ComponentChange<C>;
  widthVw?: ComponentChange<C>;
  widthVh?: ComponentChange<C>;
  widthRem?: ComponentChange<C>;
  widthPercents?: ComponentChange<C>;
}

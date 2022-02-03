import { ComponentChange } from './component-change.interface';

export interface HeightUnitChanges<C = any> {
  height?: ComponentChange<C>;
  heightPx?: ComponentChange<C>;
  heightVw?: ComponentChange<C>;
  heightVh?: ComponentChange<C>;
  heightRem?: ComponentChange<C>;
  heightPercents?: ComponentChange<C>;
}

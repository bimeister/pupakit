import { Nullable } from '@bimeister/utilities';
import { Breadcrumb } from './breadcrumb.interface';

export interface BreadcrumbsData {
  breadcrumbs: Breadcrumb[];
  breadcrumbsContainerWidthPx: number;
  isContainerFullFitted: boolean;
  breadcrumbWidthList: number[];
  isMobile: boolean;
  unfitBreadcrumbTriggerWidthPx: number;
  rootBreadcrumb: Nullable<Breadcrumb>;
}

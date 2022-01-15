import { Breadcrumb } from './breadcrumb.interface';

export interface BreadcrumbsData {
  breadcrumbs: Breadcrumb[];
  breadcrumbsContainerWidthPx: number;
  isContainerFullFitted: boolean;
  breadcrumbWidthList: number[];
  isMobile: boolean;
  unfitBreadcrumbTriggerWidthPx: number;
}

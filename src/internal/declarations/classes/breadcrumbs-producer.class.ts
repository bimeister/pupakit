import { isNil, Nullable } from '@bimeister/utilities';
import { Breadcrumb } from '../interfaces/breadcrumb.interface';
import { BreadcrumbsData } from '../interfaces/breadcrumbs-data.interface';
import { BreadcrumbsParts } from '../interfaces/breadcrumbs-parts.interface';

const UNFIT_BREADCRUMB_DESKTOP_FIRST_INDEX: number = 1;
const UNFIT_BREADCRUMB_MOBILE_FIRST_INDEX: number = 0;

export class BreadcrumbsProducer {
  private readonly breadcrumbs: Breadcrumb[];
  private readonly breadcrumbsContainerWidthPx: number;
  private readonly isContainerFullFitted: boolean;
  private readonly breadcrumbWidthList: number[];
  private readonly isMobile: boolean;
  private readonly unfitBreadcrumbTriggerWidthPx: number;
  private readonly rootBreadcrumb: Nullable<Breadcrumb>;

  constructor({
    breadcrumbs,
    breadcrumbsContainerWidthPx,
    isContainerFullFitted,
    breadcrumbWidthList,
    isMobile,
    unfitBreadcrumbTriggerWidthPx,
    rootBreadcrumb
  }: BreadcrumbsData) {
    this.breadcrumbs = breadcrumbs;
    this.breadcrumbsContainerWidthPx = breadcrumbsContainerWidthPx;
    this.isContainerFullFitted = isContainerFullFitted;
    this.breadcrumbWidthList = breadcrumbWidthList;
    this.isMobile = isMobile;
    this.unfitBreadcrumbTriggerWidthPx = unfitBreadcrumbTriggerWidthPx;
    this.rootBreadcrumb = rootBreadcrumb;
  }

  public getBreadcrumbsParts(): BreadcrumbsParts {
    const rootBreadcrumbWidth: number = this.getRootBreadcrumbWidthPx();
    const moreBreadcrumbsTriggerWidthPx: number = this.isContainerFullFitted ? 0 : this.unfitBreadcrumbTriggerWidthPx;

    const freeSpaceWidthInitial: number =
      this.breadcrumbsContainerWidthPx - rootBreadcrumbWidth - moreBreadcrumbsTriggerWidthPx;

    const unfitBreadcrumbFirstIndex: number = this.isMobile
      ? UNFIT_BREADCRUMB_MOBILE_FIRST_INDEX
      : UNFIT_BREADCRUMB_DESKTOP_FIRST_INDEX;

    const parsedUnfitBreadcrumbFirstIndex: number = Math.min(unfitBreadcrumbFirstIndex, this.breadcrumbs.length - 1);
    const fitBreadcrumbsIndexes: number[] = BreadcrumbsProducer.getFitBreadcrumbIndexes(
      freeSpaceWidthInitial,
      this.breadcrumbWidthList,
      parsedUnfitBreadcrumbFirstIndex
    );

    const unfitBreadcrumbs: Breadcrumb[] = this.breadcrumbs.slice(unfitBreadcrumbFirstIndex, fitBreadcrumbsIndexes[0]);
    const fitBreadcrumbs: Breadcrumb[] = fitBreadcrumbsIndexes.map(
      (capacityIndex: number) => this.breadcrumbs[capacityIndex]
    );

    return { unfitBreadcrumbs, fitBreadcrumbs };
  }

  private getRootBreadcrumbWidthPx(): number {
    return isNil(this.rootBreadcrumb) || this.isMobile ? 0 : this.breadcrumbWidthList[0];
  }

  private static getFitBreadcrumbIndexes(
    freeSpace: number,
    breadcrumbWidthList: number[],
    unfitBreadcrumbFirstIndex: number = 0
  ): number[] {
    let freeSpaceWidth: number = freeSpace;
    const fitBreadcrumbsIndexes: number[] = [];

    for (let i: number = breadcrumbWidthList.length - 1; i >= unfitBreadcrumbFirstIndex; --i) {
      const breadcrumbWidth: number = breadcrumbWidthList[i];

      if (freeSpaceWidth - breadcrumbWidth < 0) {
        break;
      }

      freeSpaceWidth -= breadcrumbWidth;
      fitBreadcrumbsIndexes.push(i);
    }

    return fitBreadcrumbsIndexes.reverse();
  }
}

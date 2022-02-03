import { Nullable } from '@bimeister/utilities';
import { Breadcrumb } from '../interfaces/breadcrumb.interface';
import { BreadcrumbsData } from '../interfaces/breadcrumbs-data.interface';
import { BreadcrumbsParts } from '../interfaces/breadcrumbs-parts.interface';

const UNFIT_BREADCRUMB_DESKTOP_FIRST_INDEX: number = 1;
const UNFIT_BREADCRUMB_MOBILE_FIRST_INDEX: number = 0;

interface WidthWithIndex {
  widthPx: number;
  index: number;
}
interface AccumulatedValue {
  freeSpaceWidthPx: number;
  fitBreadcrumbsIndexes: number[];
}

export class BreadcrumbsProducer {
  private readonly breadcrumbs: Breadcrumb[];
  private readonly breadcrumbsContainerWidthPx: number;
  private readonly isContainerFullFitted: boolean;
  private readonly breadcrumbWidthList: number[];
  private readonly isMobile: boolean;
  private readonly unfitBreadcrumbTriggerWidthPx: number;
  private readonly hasRoot: boolean;

  constructor({
    breadcrumbs,
    breadcrumbsContainerWidthPx,
    isContainerFullFitted,
    breadcrumbWidthList,
    isMobile,
    unfitBreadcrumbTriggerWidthPx,
  }: BreadcrumbsData) {
    this.breadcrumbs = breadcrumbs;
    this.breadcrumbsContainerWidthPx = breadcrumbsContainerWidthPx;
    this.isContainerFullFitted = isContainerFullFitted;
    this.breadcrumbWidthList = breadcrumbWidthList;
    this.isMobile = isMobile;
    this.unfitBreadcrumbTriggerWidthPx = unfitBreadcrumbTriggerWidthPx;
    this.hasRoot = breadcrumbs.length > 1;
  }

  public getBreadcrumbsParts(): BreadcrumbsParts {
    const rootBreadcrumbWidth: number = this.getRootBreadcrumbWidthPx();
    const moreBreadcrumbsTriggerWidthPx: number = this.isContainerFullFitted ? 0 : this.unfitBreadcrumbTriggerWidthPx;

    const freeSpaceWidthInitial: number =
      this.breadcrumbsContainerWidthPx - rootBreadcrumbWidth - moreBreadcrumbsTriggerWidthPx;

    const unfitBreadcrumbFirstIndex: number = this.isMobile
      ? UNFIT_BREADCRUMB_MOBILE_FIRST_INDEX
      : UNFIT_BREADCRUMB_DESKTOP_FIRST_INDEX;

    const lastBreadcrumbIndex: number = this.breadcrumbs.length - 1;
    const parsedUnfitBreadcrumbFirstIndex: number = Math.min(unfitBreadcrumbFirstIndex, lastBreadcrumbIndex);

    const fitBreadcrumbsIndexes: number[] = BreadcrumbsProducer.getFitBreadcrumbIndexes(
      freeSpaceWidthInitial,
      this.breadcrumbWidthList,
      parsedUnfitBreadcrumbFirstIndex
    );

    const firstFitBreadcrumbIndex: number = fitBreadcrumbsIndexes[0];
    const unfitBreadcrumbs: Breadcrumb[] = this.breadcrumbs.slice(unfitBreadcrumbFirstIndex, firstFitBreadcrumbIndex);

    const fitBreadcrumbs: Breadcrumb[] = fitBreadcrumbsIndexes.map(
      (capacityIndex: number) => this.breadcrumbs[capacityIndex]
    );
    const rootBreadcrumb: Nullable<Breadcrumb> = this.hasRoot ? this.breadcrumbs[0] : null;

    return { unfitBreadcrumbs, fitBreadcrumbs, rootBreadcrumb };
  }

  private getRootBreadcrumbWidthPx(): number {
    return !this.hasRoot || this.isMobile ? 0 : this.breadcrumbWidthList[0];
  }

  private static getFitBreadcrumbIndexes(
    freeSpacePx: number,
    breadcrumbWidthList: number[],
    unfitBreadcrumbFirstIndex: number = 0
  ): number[] {
    const initialReduceData: AccumulatedValue = {
      freeSpaceWidthPx: freeSpacePx,
      fitBreadcrumbsIndexes: [],
    };

    const result: AccumulatedValue = breadcrumbWidthList
      .map((widthPx: number, index: number) => ({
        widthPx,
        index,
      }))
      .filter(({ index }: WidthWithIndex) => index >= unfitBreadcrumbFirstIndex)
      .reduceRight((accumulatedValue: AccumulatedValue, currentWidthWithIndex: WidthWithIndex) => {
        const { freeSpaceWidthPx, fitBreadcrumbsIndexes }: AccumulatedValue = accumulatedValue;
        const { widthPx, index }: WidthWithIndex = currentWidthWithIndex;

        const remainingFreeSpacePx: number = freeSpaceWidthPx - widthPx;
        if (remainingFreeSpacePx < 0) {
          return accumulatedValue;
        }

        return {
          freeSpaceWidthPx: remainingFreeSpacePx,
          fitBreadcrumbsIndexes: [...fitBreadcrumbsIndexes, index],
        };
      }, initialReduceData);

    return result.fitBreadcrumbsIndexes.reverse();
  }
}

import { isNil } from '@bimeister/utilities';
import { PagedVirtualScrollArguments } from '../../interfaces/paged-virtual-scroll-arguments.interface';

export class PagedVirtualScrollArgumentsDto implements PagedVirtualScrollArguments {
  public getFrom: number = null;
  public getTo: number = null;

  public removeFrom: number = null;
  public removeTo: number = null;

  public currentFrom: number;
  public currentTo: number;

  public previousFrom: number;
  public previousTo: number;

  constructor(config: Partial<PagedVirtualScrollArguments>) {
    if (isNil(config)) {
      return;
    }
    Object.assign(this, config);
  }
}

import { isNil } from '@bimeister/utilities';
import { type PagedVirtualScrollArguments } from '../../interfaces/paged-virtual-scroll-arguments.interface';

export class PagedVirtualScrollArgumentsDto implements PagedVirtualScrollArguments {
  public getFrom: number = null;
  public getTo: number = null;

  public removeFrom: number = null;
  public removeTo: number = null;

  public currentFrom: number = null;
  public currentTo: number = null;

  public previousFrom: number = null;
  public previousTo: number = null;

  constructor(config: Partial<PagedVirtualScrollArguments>) {
    if (isNil(config)) {
      return;
    }
    Object.assign(this, config);
  }
}

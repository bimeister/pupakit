import { getUuid, Nullable } from '@bimeister/utilities';
import { BusEventBase } from '../../../internal/declarations/classes/abstract/bus-event-base.abstract';
import { InfinityScrollerOffset } from '../interfaces/infinity-scroller-offset.interface';

export namespace InfinityScrollerEvents {
  export class InfinityScrollerEventBase<T = unknown> extends BusEventBase<T> {
    public readonly scope: Nullable<string> = null;
    public readonly id: string = getUuid();
    public readonly type: Nullable<string> = null;
    public readonly payload: T = null;

    constructor(public readonly fromId: Nullable<string> = null) {
      super();
    }
  }

  export class GetNextPage<T = unknown> extends InfinityScrollerEventBase<T[]> {
    constructor(public readonly payload: T[], public readonly offset: InfinityScrollerOffset) {
      super();
    }
  }

  export class GetPreviousPage<T = unknown> extends InfinityScrollerEventBase<T[]> {
    constructor(public readonly payload: T[], public readonly offset: InfinityScrollerOffset) {
      super();
    }
  }

  export class GetSpecificPage<T = unknown> extends InfinityScrollerEventBase<T[]> {
    constructor(public readonly offset: InfinityScrollerOffset) {
      super();
    }
  }

  export class ScrollToBottom extends InfinityScrollerEventBase {
    constructor(public readonly afterRender: boolean) {
      super();
    }
  }

  export class ScrollToTop extends InfinityScrollerEventBase {
    constructor(public readonly afterRender: boolean) {
      super();
    }
  }

  export class ScrollToIndex extends InfinityScrollerEventBase {
    constructor(public readonly scrollToIndex: number, public readonly scrollOptions?: ScrollIntoViewOptions) {
      super();
    }
  }
}

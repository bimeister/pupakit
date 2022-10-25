import { Directive } from '@angular/core';
import { PopoverRef } from '../popover-ref.class';

@Directive()
export abstract class PopoverComponentBase<TData, TReturn> {
  public readonly data: TData = this.popoverRef.config.data;

  constructor(protected readonly popoverRef: PopoverRef<TData, TReturn>) {}
}

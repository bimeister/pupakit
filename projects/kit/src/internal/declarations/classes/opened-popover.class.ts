import { Observable } from 'rxjs';
import { PopoverRef } from './popover-ref.class';

export class OpenedPopover<TReturn = void> {
  public readonly id: string = this.popoverId;
  public readonly closed$: Observable<TReturn> = this.popoverRef.closed$;

  constructor(private readonly popoverId: string, private readonly popoverRef: PopoverRef<unknown, TReturn>) {}

  public close(value: TReturn): void {
    this.popoverRef.close(value);
  }
}

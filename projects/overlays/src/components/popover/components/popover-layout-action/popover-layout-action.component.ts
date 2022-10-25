import { ChangeDetectionStrategy, Component, HostListener, Inject, Input, ViewEncapsulation } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { PopoverRef } from '../../../../declarations/classes/popover-ref.class';

@Component({
  selector: 'pupa-popover-layout-action',
  templateUrl: './popover-layout-action.component.html',
  styleUrls: ['./popover-layout-action.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverLayoutActionComponent<TReturnValue> {
  @Input() public value: Nullable<TReturnValue> | 'none' = 'none';

  constructor(@Inject(PopoverRef) private readonly popoverRef: PopoverRef<unknown, TReturnValue>) {}

  @HostListener('click')
  public processActionClick(): void {
    if (this.value === 'none') {
      return;
    }
    this.popoverRef.close(this.value);
  }
}

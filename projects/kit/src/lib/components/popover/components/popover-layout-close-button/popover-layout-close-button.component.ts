import { ViewEncapsulation, ChangeDetectionStrategy, Component, HostListener, Inject, Input } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { PopoverRef } from '../../../../../internal/api';

@Component({
  selector: 'pupa-popover-layout-close-button',
  templateUrl: './popover-layout-close-button.component.html',
  styleUrls: ['./popover-layout-close-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverLayoutCloseButtonComponent<TReturnValue> {
  @Input() public value: Nullable<TReturnValue>;

  constructor(@Inject(PopoverRef) private readonly popoverRef: PopoverRef<unknown, TReturnValue>) {}

  @HostListener('click')
  public processCloseButtonClick(): void {
    this.popoverRef.close(this.value);
  }
}

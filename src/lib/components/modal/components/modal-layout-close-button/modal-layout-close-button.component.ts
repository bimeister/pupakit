import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Inject, HostListener } from '@angular/core';
import { ModalRef } from '../../../../../internal/declarations/classes/modal-ref.class';

@Component({
  selector: 'pupa-modal-layout-close-button',
  templateUrl: './modal-layout-close-button.component.html',
  styleUrls: ['./modal-layout-close-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalLayoutCloseButtonComponent<ValueT> {
  @Input() public value: ValueT | 'none' = 'none';

  constructor(@Inject(ModalRef) private readonly modalRef: ModalRef<ValueT>) {}

  @HostListener('click')
  public processCloseBUttonClick(): void {
    if (this.value === 'none') {
      return;
    }
    this.modalRef.close(this.value);
  }
}

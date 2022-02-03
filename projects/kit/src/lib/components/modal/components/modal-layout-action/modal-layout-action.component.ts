import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, HostListener, Inject } from '@angular/core';
import { ModalRef } from '../../../../../internal/declarations/classes/modal-ref.class';
import { Nullable } from '@bimeister/utilities';

@Component({
  selector: 'pupa-modal-layout-action',
  templateUrl: './modal-layout-action.component.html',
  styleUrls: ['./modal-layout-action.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayoutActionComponent<ValueT> {
  @Input() public value: Nullable<ValueT> | 'none' = 'none';

  constructor(@Inject(ModalRef) private readonly modalRef: ModalRef<ValueT>) {}

  @HostListener('click')
  public processActionClick(): void {
    if (this.value === 'none') {
      return;
    }
    this.modalRef.close(this.value);
  }
}

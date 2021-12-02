import { ChangeDetectionStrategy, Component, HostListener, Inject, Input, ViewEncapsulation } from '@angular/core';
import { Nullable } from '@bimeister/utilities';
import { ModalRef } from '../../../../../internal/declarations/classes/modal-ref.class';

@Component({
  selector: 'pupa-modal-layout-close-button',
  templateUrl: './modal-layout-close-button.component.html',
  styleUrls: ['./modal-layout-close-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayoutCloseButtonComponent<ValueT> {
  @Input() public value: Nullable<ValueT>;

  constructor(@Inject(ModalRef) private readonly modalRef: ModalRef<ValueT>) {}

  @HostListener('click')
  public processCloseButtonClick(): void {
    this.modalRef.close(this.value);
  }
}

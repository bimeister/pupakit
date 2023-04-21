import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Optional,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { Position } from '@bimeister/pupakit.common';
import { ModalRef } from '@bimeister/pupakit.overlays';
import { MODAL_DATA_TOKEN } from '../../../../declarations/tokens/modal-data.token';
import { ModalDemoLocalService } from '../services/modal-demo-local.service';

@Component({
  selector: 'demo-modal-demo-content',
  templateUrl: './modal-demo-content.component.html',
  styleUrls: ['./modal-demo-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoContentComponent {
  constructor(
    @Optional() @Inject(ModalRef) public readonly modalRef: ModalRef<string>,
    @Optional() @Inject(MODAL_DATA_TOKEN) public readonly data: number[],
    @Self() public readonly elementRef: ElementRef<HTMLElement>,
    private readonly modalDemoLocalService: ModalDemoLocalService
  ) {
    // eslint-disable-next-line no-console
    console.log(modalRef);
    // eslint-disable-next-line no-console
    console.log(data);

    this.modalDemoLocalService.logEmoji();
  }

  public changeModalPosition(newPosition: Position): void {
    this.modalRef.updatePosition(newPosition);
  }
}

import { ChangeDetectionStrategy, Component, ElementRef, Inject, Optional, Self } from '@angular/core';

import { Position } from '../../../../src/internal/declarations/types/position.type';
import { ModalRef } from '../../../../src/public-api';
import { MODAL_DATA_TOKEN } from '../../../declarations/tokens/modal-data.token';
import { ModalDemoLocalService } from '../services/modal-demo-local.service';

@Component({
  selector: 'demo-modal-demo-content',
  templateUrl: './modal-demo-content.component.html',
  styleUrls: ['./modal-demo-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDemoContentComponent {
  constructor(
    @Optional() @Inject(ModalRef) public readonly modalRef: ModalRef<string>,
    @Optional() @Inject(MODAL_DATA_TOKEN) public readonly data: number[],
    @Self() public readonly elementRef: ElementRef<HTMLElement>,
    private readonly modalDemoLocalService: ModalDemoLocalService
  ) {
    // tslint:disable-next-line: no-console
    console.log(modalRef);
    // tslint:disable-next-line: no-console
    console.log(data);

    this.modalDemoLocalService.logEmoji();
  }

  public changeModalPosition(newPosition: Position): void {
    this.modalRef.updatePosition(newPosition);
  }
}

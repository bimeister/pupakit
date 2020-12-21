import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';

import { OpenedModal } from '../../../src/internal/declarations/interfaces/opened-modal.interface';
import { Position } from '../../../src/internal/declarations/types/position.type';
import { ModalsService } from '../../../src/lib/components/modal/services/modals.service';
import { MODAL_DATA_TOKEN } from '../../declarations/tokens/modal-data.token';
import { ModalDemoContentComponent } from './modal-demo-content/modal-demo-content.component';
import { ModalDemoLocalService } from './services/modal-demo-local.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'demo-modal-demo',
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ModalDemoLocalService]
})
export class ModalDemoComponent {
  public readonly formGroup: FormGroup = new FormGroup({
    hasBackdrop: new FormControl(true),
    closeOnBackdropClick: new FormControl(true),
    isBackdropTransparent: new FormControl(false)
  });

  constructor(private readonly modalsService: ModalsService, private readonly injector: Injector) {}

  public openModal(): void {
    const openedModal: OpenedModal<string> = this.modalsService.open(ModalDemoContentComponent, {
      ...this.formGroup.value,
      injector: this.injector,
      viewportMarginPx: 10,
      providers: [
        {
          provide: MODAL_DATA_TOKEN,
          useValue: [1, 2, 3, 4]
        }
      ]
    });

    // tslint:disable-next-line: no-console
    openedModal.closed$.subscribe((text: string) => console.log(`Modal closed: ${text}`));
    // tslint:disable-next-line: no-console
    openedModal.positionUpdated$.subscribe((position: Position) => console.log('Modal position updated:', position));
  }
}

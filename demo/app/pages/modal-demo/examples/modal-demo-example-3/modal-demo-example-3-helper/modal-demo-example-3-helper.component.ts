import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ModalsService } from '../../../../../../../src/public-api';
import { ModalDemoExample3Component } from '../modal-content/modal-demo-example-3.component';

@Component({
  selector: 'pupa-modal-demo-example-3-helper',
  templateUrl: './modal-demo-example-3-helper.component.html',
  styleUrls: ['./modal-demo-example-3-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample3HelperComponent {
  constructor(private readonly modalsService: ModalsService) {}

  public openModal(): void {
    this.modalsService.open(ModalDemoExample3Component, {
      isBackdropTransparent: true,
      closeOnBackdropClick: false,
    });
  }
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ModalsService } from '../../../../../../../src/public-api';
import { ModalDemoExample4Component } from '../modal-content/modal-demo-example-4.component';

@Component({
  selector: 'pupa-modal-demo-example-4-helper',
  templateUrl: './modal-demo-example-4-helper.component.html',
  styleUrls: ['./modal-demo-example-4-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ModalDemoExample4HelperComponent {
  constructor(private readonly modalsService: ModalsService) {}

  public openModal(): void {
    this.modalsService.open(ModalDemoExample4Component);
  }
}

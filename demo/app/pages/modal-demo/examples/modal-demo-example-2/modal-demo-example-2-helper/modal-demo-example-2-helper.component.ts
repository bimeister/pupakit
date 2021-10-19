import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ModalsService } from '../../../../../../../src/public-api';
import { ModalDemoExample2Component } from '../modal-content/modal-demo-example-2.component';

@Component({
  selector: 'pupa-modal-demo-example-2-helper',
  templateUrl: './modal-demo-example-2-helper.component.html',
  styleUrls: ['./modal-demo-example-2-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ModalDemoExample2HelperComponent {
  constructor(private readonly modalsService: ModalsService) {}

  public openModal(): void {
    this.modalsService.open(ModalDemoExample2Component, { hasBackdrop: false, height: 400, width: 400 });
  }
}

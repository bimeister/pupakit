import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ModalsService } from '../../../../../../../src/public-api';
import { ModalDemoExample1Component } from '../modal-content/modal-demo-example-1.component';

@Component({
  selector: 'pupa-modal-demo-example-1-helper',
  templateUrl: './modal-demo-example-1-helper.component.html',
  styleUrls: ['./modal-demo-example-1-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class ModalDemoExample1HelperComponent {
  constructor(private readonly modalsService: ModalsService) {}

  public openModal(): void {
    this.modalsService.open(ModalDemoExample1Component, {
      height: 400,
      width: 400
    });
  }
}

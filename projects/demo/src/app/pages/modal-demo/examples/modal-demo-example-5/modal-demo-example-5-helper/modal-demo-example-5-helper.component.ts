import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ModalsService } from '@kit/public-api';
import { ModalDemoExample5Component } from '../modal-content/modal-demo-example-5.component';

@Component({
  selector: 'pupa-modal-demo-example-5-helper',
  templateUrl: './modal-demo-example-5-helper.component.html',
  styleUrls: ['./modal-demo-example-5-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample5HelperComponent {
  constructor(private readonly modalsService: ModalsService) {}

  public openModal(): void {
    this.modalsService.open(ModalDemoExample5Component);
  }
}

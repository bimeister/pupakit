import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-modal-demo-example-2',
  templateUrl: './modal-demo-example-2.component.html',
  styleUrls: ['./modal-demo-example-2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample2Component {}

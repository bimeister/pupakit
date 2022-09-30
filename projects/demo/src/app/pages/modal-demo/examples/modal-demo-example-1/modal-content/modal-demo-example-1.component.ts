import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-modal-demo-example-1',
  templateUrl: './modal-demo-example-1.component.html',
  styleUrls: ['./modal-demo-example-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ModalDemoExample1Component {}

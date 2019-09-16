import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-modal-demo-content',
  templateUrl: './modal-demo-content.component.html',
  styleUrls: ['./modal-demo-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDemoContentComponent {}

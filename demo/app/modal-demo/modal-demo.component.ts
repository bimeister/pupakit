import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-modal-demo',
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalDemoComponent {
  public smallOpen: boolean = false;
  public mediumOpen: boolean = false;
  public bigOpen: boolean = false;
}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-modal-layout-header',
  templateUrl: './modal-layout-header.component.html',
  styleUrls: ['./modal-layout-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayoutHeaderComponent {}

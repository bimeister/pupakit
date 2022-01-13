import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { AlertType } from '../../../../../internal/declarations/types/alert-type.type';

@Component({
  selector: 'pupa-toast-layout',
  templateUrl: './toast-layout.component.html',
  styleUrls: ['./toast-layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastLayoutComponent {
  @Input() public type: AlertType;
}

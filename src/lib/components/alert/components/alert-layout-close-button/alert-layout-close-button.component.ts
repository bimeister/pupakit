import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-alert-layout-close-button',
  templateUrl: './alert-layout-close-button.component.html',
  styleUrls: ['./alert-layout-close-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertLayoutCloseButtonComponent {}

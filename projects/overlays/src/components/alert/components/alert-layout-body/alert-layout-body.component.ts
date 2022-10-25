import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-alert-layout-body',
  templateUrl: './alert-layout-body.component.html',
  styleUrls: ['./alert-layout-body.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertLayoutBodyComponent {}

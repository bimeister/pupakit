import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-alert-layout-header',
  templateUrl: './alert-layout-header.component.html',
  styleUrls: ['./alert-layout-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertLayoutHeaderComponent {}

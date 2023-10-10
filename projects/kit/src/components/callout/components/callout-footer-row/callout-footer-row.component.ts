import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-callout-footer-row',
  templateUrl: './callout-footer-row.component.html',
  styleUrls: ['./callout-footer-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutFooterRowComponent {}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-badge-content',
  templateUrl: './badge-content.component.html',
  styleUrls: ['./badge-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeContentComponent {}

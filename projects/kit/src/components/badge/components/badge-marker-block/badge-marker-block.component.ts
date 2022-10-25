import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-badge-marker-block',
  templateUrl: './badge-marker-block.component.html',
  styleUrls: ['./badge-marker-block.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeMarkerBlockComponent {}

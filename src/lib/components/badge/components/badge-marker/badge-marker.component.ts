import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BadgeSize } from '../../../../../internal/declarations/types/badge-size.type';

@Component({
  selector: 'pupa-badge-marker',
  templateUrl: './badge-marker.component.html',
  styleUrls: ['./badge-marker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeMarkerComponent {
  @Input() public readonly size: BadgeSize = 'medium';
}

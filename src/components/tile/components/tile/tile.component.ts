import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pupa-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {
  @Input() public shadowOnHover: boolean = true;
}

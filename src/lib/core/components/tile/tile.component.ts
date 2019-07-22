import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pupa-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {}

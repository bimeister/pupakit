import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type TileColumnsCount = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '';
@Component({
  selector: 'pupa-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {
  @Input() public columns: TileColumnsCount = '';
  public get classModifier(): string {
    return `tile_columns-${this.columns}`;
  }
}

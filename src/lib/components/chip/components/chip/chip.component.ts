import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChipColor } from '../../../../../internal/declarations/types/chip-color.type';

@Component({
  selector: 'pupa-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent {
  @Input() public color: ChipColor = 'normal';
}

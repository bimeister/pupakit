import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

import { ColorTagColor } from '../../../../../internal/declarations/types/color-tag.types';

@Component({
  selector: 'pupa-color-tag',
  templateUrl: './color-tag.component.html',
  styleUrls: ['./color-tag.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorTagComponent {
  @Input() private readonly color: ColorTagColor = 'primary';

  public get colorClass(): string {
    return `color-tag_${this.color}`;
  }
}

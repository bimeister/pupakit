import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';

@Component({
  selector: 'pupa-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputTextComponent<T> extends InputBase<T> {}

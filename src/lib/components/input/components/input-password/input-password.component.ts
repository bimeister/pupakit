import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { InputBase } from '../../../../../internal/declarations/classes/abstract/input-base.abstract';

@Component({
  selector: 'pupa-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPasswordComponent<T> extends InputBase<T> {}

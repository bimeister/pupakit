import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RadioControlBase } from '../../../../declarations/classes/abstract/radio-control-base.abstract';

@Component({
  selector: 'pupa-radio-control',
  templateUrl: './radio-control.component.html',
  styleUrls: ['./radio-control.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioControlComponent<T> extends RadioControlBase<T> {}

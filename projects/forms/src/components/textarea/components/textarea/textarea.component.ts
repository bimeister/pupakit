import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TextareaBase } from '../../../../declarations/classes/abstract/textarea-base.abstract';

@Component({
  selector: 'pupa-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends TextareaBase {}

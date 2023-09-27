import { ChangeDetectionStrategy, Component, ContentChild, ViewEncapsulation } from '@angular/core';
import { RadioImageDirective } from '../../directives/radio-image.directive';
import { RadioIconDirective } from '../../directives/radio-icon.directive';
import { RadioControlBase } from '../../../../declarations/classes/abstract/radio-control-base.abstract';

@Component({
  selector: 'pupa-radio-image-control',
  templateUrl: './radio-image-control.component.html',
  styleUrls: ['./radio-image-control.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioImageControlComponent<T> extends RadioControlBase<T> {
  @ContentChild(RadioImageDirective) public readonly radioImageDirective: RadioImageDirective;
  @ContentChild(RadioIconDirective) public readonly radioIconDirective: RadioIconDirective;
}

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { IconHolderSize } from '../../../internal/declarations/types/icon-holder-size.type';

@Component({
  selector: 'pupa-icon-holder',
  templateUrl: './icon-holder.component.html',
  styleUrls: ['./icon-holder.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconHolderComponent {
  @Input() public size: IconHolderSize = 'large';

  @Input() public withBackground: boolean = true;
}

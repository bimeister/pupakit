import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-option-icon',
  templateUrl: './option-icon.component.html',
  styleUrls: ['./option-icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionIconComponent {
  @Input() public name: string;
  @Input() public src: string;
}

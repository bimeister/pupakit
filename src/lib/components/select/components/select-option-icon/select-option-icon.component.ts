import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-select-option-icon',
  templateUrl: './select-option-icon.component.html',
  styleUrls: ['./select-option-icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionIconComponent {
  @Input() public name: string;
  @Input() public src: string;
}

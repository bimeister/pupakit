import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-select-item-icon',
  templateUrl: './select-item-icon.component.html',
  styleUrls: ['./select-item-icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectItemIconComponent {
  @Input() public name: string;
  @Input() public src: string;
}

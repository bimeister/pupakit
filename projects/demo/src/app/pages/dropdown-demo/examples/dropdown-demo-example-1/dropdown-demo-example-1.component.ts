import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DropdownWidthType } from '@bimeister/pupakit.kit';
import { DropdownMenuPosition } from '@bimeister/pupakit.kit/declarations/types/dropdown-menu-position.type';

@Component({
  selector: 'demo-dropdown-example-1',
  templateUrl: './dropdown-demo-example-1.component.html',
  styleUrls: ['./dropdown-demo-example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownDemoExample1Component {
  @Input() public disabled: boolean;
  @Input() public widthType: DropdownWidthType;
  @Input() public position: DropdownMenuPosition = 'bottomCenter';
}

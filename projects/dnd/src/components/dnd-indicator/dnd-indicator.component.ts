import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-dnd-indicator',
  templateUrl: './dnd-indicator.component.html',
  styleUrls: ['./dnd-indicator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndIndicatorComponent {
  @Input() public topCoordsPx: number = 0;
}

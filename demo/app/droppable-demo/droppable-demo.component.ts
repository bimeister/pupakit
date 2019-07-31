import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-dropdown',
  styleUrls: ['../demo.scss', './droppable-demo.component.scss'],
  templateUrl: './droppable-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DroppableDemoComponent {
}

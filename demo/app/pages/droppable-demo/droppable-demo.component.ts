import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-dropdown',
  styleUrls: ['../demo.scss', './droppable-demo.component.scss'],
  templateUrl: './droppable-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DroppableDemoComponent {}

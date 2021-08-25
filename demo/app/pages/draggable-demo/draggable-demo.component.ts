import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-draggable-demo',
  templateUrl: './draggable-demo.component.html',
  styleUrls: ['./draggable-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableDemoComponent {}

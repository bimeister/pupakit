import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pupa-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableComponent {}

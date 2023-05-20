import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-dnd-clone-item',
  templateUrl: './dnd-clone-item.component.html',
  styleUrls: ['./dnd-clone-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndCloneItemComponent {}

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-dnd-clone-wrapper',
  templateUrl: './dnd-clone-wrapper.component.html',
  styleUrls: ['./dnd-clone-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndCloneWrapperComponent {}

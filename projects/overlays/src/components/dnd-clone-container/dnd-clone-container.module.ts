import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DndCloneContainerComponent } from './components/dnd-clone-container/dnd-clone-container.component';

@NgModule({
  declarations: [DndCloneContainerComponent],
  imports: [CommonModule],
  exports: [DndCloneContainerComponent],
})
export class PupaDndCloneContainerModule {}

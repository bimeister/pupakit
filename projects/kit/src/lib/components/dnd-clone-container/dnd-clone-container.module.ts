import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { DndCloneContainerComponent } from './components/dnd-clone-container/dnd-clone-container.component';

@NgModule({
  declarations: [DndCloneContainerComponent],
  imports: [CommonModule, ThemeWrapperModule],
  exports: [DndCloneContainerComponent],
})
export class DndCloneContainerModule {}

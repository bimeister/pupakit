import { NgModule, Type } from '@angular/core';
import { DndHostComponent } from './components/dnd-host/dnd-host.component';
import { CommonModule } from '@angular/common';
import { DndItemDirective } from './directives/dnd-item.directive';
import { DndCloneContainerComponent } from './components/dnd-clone-container/dnd-clone-container.component';
import { DndCloneWrapperComponent } from './components/dnd-clone-wrapper/dnd-clone-wrapper.component';
import { DndIndicatorComponent } from './components/dnd-indicator/dnd-indicator.component';

const DECLARATIONS: Type<unknown>[] = [
  DndHostComponent,
  DndItemDirective,
  DndCloneContainerComponent,
  DndCloneWrapperComponent,
  DndIndicatorComponent,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [CommonModule],
  exports: DECLARATIONS,
})
export class PupaDndModule {}

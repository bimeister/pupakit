import { NgModule, Type } from '@angular/core';
import { DndHostComponent } from './components/dnd-host/dnd-host.component';
import { CommonModule } from '@angular/common';
import { DndCloneContainerComponent } from './components/dnd-clone-container/dnd-clone-container.component';
import { DndCloneItemsComponent } from './components/dnd-clone-items/dnd-clone-items.component';
import { DndIndicatorComponent } from './components/dnd-indicator/dnd-indicator.component';
import { DndItemDirective } from './directives/dnd-item.directive';
import { DndStartTriggerDirective } from './directives/dnd-start-trigger.directive';
import { DndCloneItemTemplateDirective } from './directives/dnd-clone-item-template.directive';
import { DndCloneGroupItemsTemplateDirective } from './directives/dnd-clone-group-items-template.directive';
import { DndCloneItemComponent } from './components/dnd-clone-item/dnd-clone-item.component';

const DECLARATIONS: Type<unknown>[] = [
  DndHostComponent,
  DndItemDirective,
  DndStartTriggerDirective,
  DndCloneContainerComponent,
  DndCloneItemsComponent,
  DndCloneItemComponent,
  DndCloneItemTemplateDirective,
  DndCloneGroupItemsTemplateDirective,
  DndIndicatorComponent,
];

@NgModule({
  declarations: DECLARATIONS,
  imports: [CommonModule],
  exports: DECLARATIONS,
})
export class PupaDndModule {}

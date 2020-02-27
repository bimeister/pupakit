import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DroppableContentComponent } from './components/droppable-content/droppable-content.component';
import { DroppableLegacyComponent } from './components/droppable-legacy/droppable-legacy.component';
import { DroppableTriggerComponent } from './components/droppable-trigger/droppable-trigger.component';
import { DroppableComponent } from './components/droppable/droppable.component';

@NgModule({
  declarations: [DroppableLegacyComponent, DroppableTriggerComponent, DroppableContentComponent, DroppableComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DroppableLegacyComponent, DroppableTriggerComponent, DroppableContentComponent, DroppableComponent]
})
export class DroppableModule {}

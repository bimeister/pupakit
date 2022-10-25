import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DroppableContentComponent } from './components/droppable-content/droppable-content.component';
import { DroppableLegacyComponent } from './components/droppable-legacy/droppable-legacy.component';
import { DroppableNativeContentComponent } from './components/droppable-native-content/droppable-native-content.component';
import { DroppableTriggerComponent } from './components/droppable-trigger/droppable-trigger.component';
import { DroppableComponent } from './components/droppable/droppable.component';

@NgModule({
  declarations: [
    DroppableLegacyComponent,
    DroppableTriggerComponent,
    DroppableContentComponent,
    DroppableComponent,
    DroppableNativeContentComponent,
  ],
  imports: [CommonModule, OverlayModule, PortalModule],
  exports: [
    DroppableLegacyComponent,
    DroppableTriggerComponent,
    DroppableContentComponent,
    DroppableComponent,
    DroppableNativeContentComponent,
  ],
})
export class PupaDroppableModule {}

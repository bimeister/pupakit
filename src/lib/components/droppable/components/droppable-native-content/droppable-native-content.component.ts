import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { DroppableContent } from '../../../../../internal/declarations/classes/abstract/droppable-content.abstract';

@Component({
  selector: 'pupa-droppable-native-content',
  templateUrl: './droppable-native-content.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DroppableNativeContentComponent extends DroppableContent {}

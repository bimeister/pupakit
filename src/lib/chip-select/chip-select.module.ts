import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ChipButtonModule } from '../chip-button';
import { DroppableModule } from '../droppable';
import { AngularComponent, SharedModule } from './../../internal';
import { ChipSelectComponent, ChipSelectTreeComponent, ChipSelectTreeNodeComponent } from './components';

const COMPONENTS: AngularComponent[] = [ChipSelectComponent, ChipSelectTreeComponent, ChipSelectTreeNodeComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, DroppableModule, ChipButtonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class ChipSelectModule {}

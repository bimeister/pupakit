import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { TagComponent } from './components/tag/tag.component';
import { ColorTagComponent } from './components/color-tag/color-tag.component';

const COMPONENTS: Type<unknown>[] = [TagComponent, ColorTagComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTS]
})
export class TagModule {}

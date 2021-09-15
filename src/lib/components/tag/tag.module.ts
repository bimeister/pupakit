import { NgModule, Type } from '@angular/core';
import { TagComponent } from './components/tag/tag.component';
import { SharedModule } from '../../../internal/shared/shared.module';

const COMPONENTS: Type<unknown>[] = [TagComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTS]
})
export class TagModule {}

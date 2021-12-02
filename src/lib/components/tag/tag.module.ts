import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { TagDeleteButtonComponent } from './components/pupa-tag-delete-button/pupa-tag-delete-button.component';
import { TagComponent } from './components/tag/tag.component';

const COMPONENTS: Type<unknown>[] = [TagComponent, TagDeleteButtonComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, IconModule],
  exports: [...EXPORTS],
})
export class TagModule {}

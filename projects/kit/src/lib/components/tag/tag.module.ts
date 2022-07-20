import { NgModule, Type } from '@angular/core';
import { appExceptionsCross8Icon } from '../../../internal/constants/icons/app-exceptions-cross-8-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { TagDeleteButtonComponent } from './components/pupa-tag-delete-button/pupa-tag-delete-button.component';
import { TagTextComponent } from './components/pupa-tag-text/pupa-tag-text.component';
import { TagActionButtonComponent } from './components/tag-action-button/tag-action-button.component';
import { TagComponent } from './components/tag/tag.component';
import { TagActionButtonTemplateDirective } from './directives/tag-action-button-template.directive';

const COMPONENTS: Type<unknown>[] = [
  TagComponent,
  TagDeleteButtonComponent,
  TagTextComponent,
  TagActionButtonComponent,
];

const DIRECTIVES: Type<unknown>[] = [TagActionButtonTemplateDirective];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS, ...DIRECTIVES];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, IconModule.forFeature([appExceptionsCross8Icon])],
  exports: [...EXPORTS],
})
export class TagModule {}

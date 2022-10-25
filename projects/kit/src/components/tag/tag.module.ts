import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { appExceptionsCross8Icon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaDropdownModule } from '../dropdown/dropdown.module';
import { PupaIconModule } from '../icon/icon.module';
import { TagDeleteButtonComponent } from './components/pupa-tag-delete-button/pupa-tag-delete-button.component';
import { TagTextComponent } from './components/pupa-tag-text/pupa-tag-text.component';
import { TagActionButtonComponent } from './components/tag-action-button/tag-action-button.component';
import { TagInlineComponent } from './components/tag-inline/tag-inline.component';
import { TagComponent } from './components/tag/tag.component';
import { TagActionButtonTemplateDirective } from './directives/tag-action-button-template.directive';

const COMPONENTS: Type<unknown>[] = [
  TagComponent,
  TagDeleteButtonComponent,
  TagTextComponent,
  TagActionButtonComponent,
  TagInlineComponent,
];

const DIRECTIVES: Type<unknown>[] = [TagActionButtonTemplateDirective];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS, ...DIRECTIVES];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, PupaDropdownModule, PupaIconModule, PupaIconsModule.forFeature([appExceptionsCross8Icon])],
  exports: [...EXPORTS],
})
export class PupaTagModule {}

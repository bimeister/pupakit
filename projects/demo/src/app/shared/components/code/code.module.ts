import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Type } from '@angular/core';
import { iosCopyIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule, PupaTabsModule } from '@bimeister/pupakit.kit';
import { HighlightModule, HighlightOptions, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { CodeContainerComponent } from './components/code-container/code-container.component';
import { CodeFetchComponent } from './components/code-fetch/code-fetch.component';
import { CodeInlineComponent } from './components/code-inline/code-inline.component';
import { CodeComponent } from './components/code/code.component';
import { CodeContainerPreviewTemplateDirective } from './directives/code-container-preview-template.directive';

const HIGHLIGHT_CONFIG: HighlightOptions = {
  fullLibraryLoader: () => import('highlight.js'),
  lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
};

const COMPONENTS: Type<unknown>[] = [CodeComponent, CodeContainerComponent, CodeFetchComponent, CodeInlineComponent];
const DIRECTIVES: Type<unknown>[] = [CodeContainerPreviewTemplateDirective];
const DECLARATIONS: Type<unknown>[] = [...COMPONENTS, ...DIRECTIVES];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
  imports: [
    CommonModule,
    PupaTabsModule,
    PupaButtonsModule,
    PupaIconsModule.forFeature([iosCopyIcon]),
    HighlightModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: HIGHLIGHT_CONFIG,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CodeModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { CodeComponent } from './components/code/code.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

@NgModule({
  declarations: [CodeComponent],
  exports: [CodeComponent],
  imports: [SharedModule, HighlightModule],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js')
      }
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CodeModule {}

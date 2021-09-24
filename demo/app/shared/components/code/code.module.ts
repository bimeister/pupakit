import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CodeComponent } from './components/code/code.component';
import { HighlightModule, HighlightOptions, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { CodeContainerComponent } from './components/code-container/code-container.component';
import { SharedModule } from '../../../../../src/internal/shared/shared.module';
import { TabsModule } from '../../../../../src/lib/components/tabs/tabs.module';
import { ButtonModule } from '../../../../../src/lib/components/button/button.module';
import { IconModule } from '../../../../../src/lib/components/icon/icon.module';
import { iosCopyIcon } from '../../../../../src/internal/constants/icons/ios-copy-icon.const';
import { CodeFetchComponent } from './components/code-fetch/code-fetch.component';

const HIGHLIGHT_CONFIG: HighlightOptions = {
  fullLibraryLoader: () => import('highlight.js'),
  lineNumbersLoader: () => import('highlightjs-line-numbers.js')
};

@NgModule({
  declarations: [CodeComponent, CodeContainerComponent, CodeFetchComponent],
  exports: [CodeComponent, CodeContainerComponent, CodeFetchComponent],
  imports: [SharedModule, TabsModule, ButtonModule, IconModule.forFeature([iosCopyIcon]), HighlightModule],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: HIGHLIGHT_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CodeModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { CodeComponent } from './components/code/code.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { CodeContainerComponent } from './components/code-container/code-container.component';
import { TabsModule } from '../tabs/tabs.module';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { iosCopyIcon } from '../../../internal/constants/icons/ios-copy-icon.const';

@NgModule({
  declarations: [CodeComponent, CodeContainerComponent],
  exports: [CodeComponent, CodeContainerComponent],
  imports: [SharedModule, TabsModule, ButtonModule, IconModule.forFeature([iosCopyIcon]), HighlightModule],
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

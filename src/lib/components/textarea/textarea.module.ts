import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { TextareaInlineComponent } from './components/textarea-inline/textarea-inline.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ButtonModule } from '../button/button.module';
import { PortalModule } from '@angular/cdk/portal';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';

@NgModule({
  declarations: [TextareaComponent, TextareaInlineComponent],
  imports: [SharedModule, ScrollableModule, ButtonModule, ThemeWrapperModule, OverlayModule, PortalModule],
  exports: [TextareaComponent, TextareaInlineComponent],
})
export class TextareaModule {}

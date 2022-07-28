import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { TextareaInlineComponent } from './components/textarea-inline/textarea-inline.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { ButtonModule } from '../buttons/button.module';

@NgModule({
  declarations: [TextareaComponent, TextareaInlineComponent],
  imports: [SharedModule, ScrollableModule, ButtonModule, ThemeWrapperModule, OverlayModule, PortalModule],
  exports: [TextareaComponent, TextareaInlineComponent],
})
export class TextareaModule {}

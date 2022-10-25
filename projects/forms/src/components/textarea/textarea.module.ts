import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PupaIconsModule, mCollapseIcon } from '@bimeister/pupakit.icons';
import { PupaIconModule, PupaScrollableModule, PupaThemeWrapperModule } from '@bimeister/pupakit.kit';
import { TextareaInlineComponent } from './components/textarea-inline/textarea-inline.component';
import { TextareaComponent } from './components/textarea/textarea.component';

@NgModule({
  declarations: [TextareaComponent, TextareaInlineComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaScrollableModule,
    PupaIconModule,
    PupaIconsModule.forFeature([mCollapseIcon]),
    PupaThemeWrapperModule,
    OverlayModule,
    PortalModule,
  ],
  exports: [TextareaComponent, TextareaInlineComponent],
})
export class PupaTextareaModule {}

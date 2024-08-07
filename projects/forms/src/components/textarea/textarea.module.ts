import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { appErrorFilledIcon, appMinimizeIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import {
  PupaIconHolderModule,
  PupaScrollableModule,
  PupaThemeWrapperModule,
  PupaTooltipModule,
} from '@bimeister/pupakit.kit';
import { TextareaInlineComponent } from './components/textarea-inline/textarea-inline.component';
import { TextareaComponent } from './components/textarea/textarea.component';

@NgModule({
  declarations: [TextareaComponent, TextareaInlineComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PupaScrollableModule,
    PupaIconsModule.forFeature([appMinimizeIcon, appErrorFilledIcon]),
    PupaThemeWrapperModule,
    OverlayModule,
    PortalModule,
    PupaIconHolderModule,
    PupaTooltipModule,
  ],
  exports: [TextareaComponent, TextareaInlineComponent],
})
export class PupaTextareaModule {}

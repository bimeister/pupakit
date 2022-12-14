import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { PupaThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { TooltipContentComponent } from './components/tooltip-content/tooltip-content.component';
import { PupaTooltipDirective } from './directives/tooltip.directive';

const INTERNAL_COMPONENTS: Type<unknown>[] = [TooltipContentComponent];

const EXTERNAL_DIRECTIVES: Type<unknown>[] = [PupaTooltipDirective];

const IMPORTS: (Type<unknown> | ModuleWithProviders<unknown>)[] = [CommonModule, PupaThemeWrapperModule, OverlayModule];

@NgModule({
  declarations: [...INTERNAL_COMPONENTS, ...EXTERNAL_DIRECTIVES],
  imports: IMPORTS,
  exports: [...EXTERNAL_DIRECTIVES],
})
export class PupaTooltipModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';
import { PupaDirectivesModule, PupaPipesModule } from '@bimeister/pupakit.common';
import { PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaTooltipModule } from '../tooltip/tooltip.module';

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule, PupaPipesModule, PupaIconsModule, PupaTooltipModule, PupaDirectivesModule],
  exports: [LoaderComponent],
})
export class PupaLoaderModule {}

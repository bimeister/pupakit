import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import { mdCloseIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaLoaderModule } from '../loader/loader.module';
import { LayoutComponent } from './components/layout/layout.component';
import { LoaderOldComponent } from './components/loader-old/loader-old.component';

@NgModule({
  imports: [CommonModule, PupaIconsModule.forFeature([mdCloseIcon]), PupaLoaderModule, PupaPipesModule],
  declarations: [LayoutComponent, LoaderOldComponent],
  exports: [LayoutComponent, LoaderOldComponent],
})
export class PupaLayoutModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import { mdCloseIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaSpinnerModule } from '../spinner/spinner.module';

import { LayoutComponent } from './components/layout/layout.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  imports: [CommonModule, PupaIconsModule.forFeature([mdCloseIcon]), PupaSpinnerModule, PupaPipesModule],
  declarations: [LayoutComponent, LoaderComponent],
  exports: [LayoutComponent, LoaderComponent],
})
export class PupaLayoutModule {}

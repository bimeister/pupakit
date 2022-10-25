import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import { PupaIconsModule, mdCloseIcon } from '@bimeister/pupakit.icons';
import { PupaIconModule } from '../icon/icon.module';
import { PupaSpinnerModule } from '../spinner/spinner.module';

import { LayoutComponent } from './components/layout/layout.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    PupaIconModule,
    PupaIconsModule.forFeature([mdCloseIcon]),
    PupaSpinnerModule,
    PupaPipesModule,
  ],
  declarations: [LayoutComponent, LoaderComponent],
  exports: [LayoutComponent, LoaderComponent],
})
export class PupaLayoutModule {}

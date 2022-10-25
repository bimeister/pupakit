import { NgModule } from '@angular/core';
import { PupaDirectivesModule } from './directives/directives.module';
import { PupaPipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [],
  imports: [PupaPipesModule, PupaDirectivesModule],
  exports: [PupaPipesModule, PupaDirectivesModule],
})
export class PupaCommonModule {}

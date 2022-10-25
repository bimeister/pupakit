import { NgModule, Type } from '@angular/core';
import { PupaTreeLayoutModule } from './components/tree-layout/tree-layout.module';
import { PupaTreeNewModule } from './components/tree-new/tree-new.module';

const MODULES: Type<unknown>[] = [PupaTreeLayoutModule, PupaTreeNewModule];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class PupaTreeModule {}

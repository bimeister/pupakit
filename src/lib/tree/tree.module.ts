import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from './../../internal';
import { TreeComponent } from './components';

const COMPONENTS: AngularComponent[] = [TreeComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, ScrollingModule, CdkTreeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class TreeModule {}

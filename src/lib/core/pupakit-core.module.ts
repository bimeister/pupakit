import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LayoutComponent } from './components/layout/layout.component';

const CORE_COMPONENTS: any[] = [LayoutComponent];

@NgModule({
  imports: [SharedModule],
  declarations: [...CORE_COMPONENTS],
  exports: [SharedModule, ...CORE_COMPONENTS]
})
export class PupakitCore {}

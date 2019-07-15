import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { LayoutComponent } from './components/layout/layout.component';

const CORE_COMPONENTS: any[] = [LayoutComponent, ButtonComponent, InputComponent];

@NgModule({
  imports: [SharedModule],
  declarations: [...CORE_COMPONENTS],
  exports: [SharedModule, ...CORE_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PupakitCore {}

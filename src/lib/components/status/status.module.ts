import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { StatusComponent } from './components/status/status.component';

const COMPONENTS: Type<unknown>[] = [StatusComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTS],
})
export class StatusModule {}

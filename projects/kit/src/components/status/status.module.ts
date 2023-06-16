import { NgModule, Type } from '@angular/core';
import { StatusComponent } from './components/status/status.component';
import { CommonModule } from '@angular/common';

const COMPONENTS: Type<unknown>[] = [StatusComponent];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];
const EXPORTS: Type<unknown>[] = [...DECLARATIONS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule],
  exports: [...EXPORTS],
})
export class PupaStatusModule {}

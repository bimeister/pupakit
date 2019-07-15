import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IsNullOrUndefinedPipe } from './pipes/is-null-or-undefined.pipe';

const SHARED_COMPONENTS: any[] = [];
const SHARED_PIPES: any[] = [IsNullOrUndefinedPipe];
const SHARED_MODULES: any[] = [CommonModule, FormsModule];

@NgModule({
  declarations: [...SHARED_COMPONENTS, ...SHARED_PIPES],
  imports: [...SHARED_MODULES],
  exports: [...SHARED_MODULES, ...SHARED_COMPONENTS, ...SHARED_PIPES]
})
export class SharedModule {}

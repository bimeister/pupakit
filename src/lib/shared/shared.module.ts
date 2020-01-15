import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IsNullOrUndefinedPipe } from './pipes/is-null-or-undefined.pipe';
import { ToString } from './pipes/to-string.pipe';

const SHARED_COMPONENTS: any[] = [];
const SHARED_PIPES: any[] = [IsNullOrUndefinedPipe, ToString];
const SHARED_MODULES: any[] = [CommonModule, FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [...SHARED_COMPONENTS, ...SHARED_PIPES],
  imports: [...SHARED_MODULES],
  exports: [...SHARED_MODULES, ...SHARED_COMPONENTS, ...SHARED_PIPES]
})
export class SharedModule {}

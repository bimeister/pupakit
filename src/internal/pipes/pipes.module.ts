import { NgModule } from '@angular/core';

import { IsNullOrUndefinedPipe } from './is-null-or-undefined.pipe';
import { ToString } from './to-string.pipe';

const SHARED_PIPES: any[] = [IsNullOrUndefinedPipe, ToString];

@NgModule({
  declarations: [...SHARED_PIPES],
  exports: [...SHARED_PIPES]
})
export class PipesModule {}

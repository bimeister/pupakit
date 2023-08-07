import { NgModule } from '@angular/core';
import { FormatCountPipe } from './format-count.pipe';

import { IsNullOrUndefinedPipe } from './is-null-or-undefined.pipe';
import { TimeDigitFormatPipe } from './time-format.pipe';
import { ToString } from './to-string.pipe';

const SHARED_PIPES: any[] = [IsNullOrUndefinedPipe, ToString, TimeDigitFormatPipe, FormatCountPipe];

@NgModule({
  declarations: [...SHARED_PIPES],
  exports: [...SHARED_PIPES],
})
export class PupaPipesModule {}

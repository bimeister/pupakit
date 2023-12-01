import { NgModule, Type } from '@angular/core';
import { PupaAutofocusDirective } from './autofocus.directive';
import { LetDirective } from './let.directive';
import { HighlightDirective } from './highlight.directive';

const SHARED_DIRECTIVES: Type<unknown>[] = [PupaAutofocusDirective, LetDirective, HighlightDirective];

@NgModule({
  declarations: [...SHARED_DIRECTIVES],
  exports: [...SHARED_DIRECTIVES],
})
export class PupaDirectivesModule {}

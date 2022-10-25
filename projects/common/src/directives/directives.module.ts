import { NgModule, Type } from '@angular/core';
import { PupaAutofocusDirective } from './autofocus.directive';
import { LetDirective } from './let.directive';

const SHARED_DIRECTIVES: Type<unknown>[] = [PupaAutofocusDirective, LetDirective];

@NgModule({
  declarations: [...SHARED_DIRECTIVES],
  exports: [...SHARED_DIRECTIVES],
})
export class PupaDirectivesModule {}

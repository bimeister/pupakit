import { NgModule } from '@angular/core';
import { PupaAutofocusDirective } from './autofocus.directive';

const SHARED_DIRECTIVES: any[] = [PupaAutofocusDirective];

@NgModule({
  declarations: [...SHARED_DIRECTIVES],
  exports: [...SHARED_DIRECTIVES]
})
export class DirectivesModule {}

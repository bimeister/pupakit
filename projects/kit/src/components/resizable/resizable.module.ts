import { NgModule, Type } from '@angular/core';
import { PupaResizableDirective } from './directives/resizable.directive';
import { PupaResizerDirective } from './directives/resizer.directive';
import { CommonModule } from '@angular/common';

const EXPORTS: Type<unknown>[] = [PupaResizableDirective, PupaResizerDirective];

@NgModule({
  declarations: EXPORTS,
  imports: [CommonModule],
  exports: EXPORTS,
})
export class ResizableModule {}

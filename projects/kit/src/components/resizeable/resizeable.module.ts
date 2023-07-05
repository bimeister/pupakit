import { NgModule, Type } from '@angular/core';
import { PupaResizeableDirective } from './directives/resizeable.directive';
import { PupaResizerDirective } from './directives/resizer.directive';
import { CommonModule } from '@angular/common';

const EXPORTS: Type<unknown>[] = [PupaResizeableDirective, PupaResizerDirective]

@NgModule({
  declarations: [...EXPORTS],
  imports: [CommonModule],
  exports: EXPORTS
})
export class ResizeableModule { }

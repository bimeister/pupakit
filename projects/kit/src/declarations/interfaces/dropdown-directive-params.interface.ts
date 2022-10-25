import { HorizontalConnectionPos } from '@angular/cdk/overlay';
import { TemplateRef } from '@angular/core';
import { DropdownWidthType } from '../types/dropdown-width.type';
import { DropdownTemplateContext } from './dropdown-template-context.interface';

export interface DropdownDirectiveParams {
  templateRef: TemplateRef<DropdownTemplateContext>;
  widthType: DropdownWidthType;
  horizontalPosition: HorizontalConnectionPos;
}

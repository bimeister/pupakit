import { TemplateRef } from '@angular/core';
import { DropdownWidthType } from '../types/dropdown-width.type';
import { DropdownTemplateContext } from './dropdown-template-context.interface';
import { DropdownMenuPosition } from '../types/dropdown-menu-position.type';

export interface DropdownDirectiveParams {
  templateRef: TemplateRef<DropdownTemplateContext>;
  widthType: DropdownWidthType;
  position?: DropdownMenuPosition;
}

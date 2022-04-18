import { HorizontalConnectionPos } from '@angular/cdk/overlay';
import { ElementRef, TemplateRef } from '@angular/core';
import { Nullable } from '@bimeister/utilities/common';
import { Observable } from 'rxjs';
import { DropdownBase } from '../../../lib/components/dropdown-menu/declarations/classes/abstract/dropdown-base.abstract';
import { Uuid } from '../types/uuid.type';

export interface DropdownMenuService<DropdownClass extends DropdownBase<unknown> = DropdownBase<unknown>> {
  setDropdownHorizontalPosition(id: Uuid, position: HorizontalConnectionPos): void;

  registerDropdown(id: Uuid, dropdown: DropdownClass): void;

  unregisterDropdown(id: Uuid): void;

  setDropdownTemplate(id: Uuid, template: TemplateRef<unknown>): void;

  setDropdownIsOpen(id: Uuid, isOpen: boolean): void;

  setDropdownTriggerRef(id: Uuid, triggerRef: ElementRef<HTMLElement>): void;

  getDropdownTemplate(id: Uuid): Observable<Nullable<TemplateRef<unknown>>>;

  getDropdownIsOpen(id: Uuid): Observable<boolean>;
}

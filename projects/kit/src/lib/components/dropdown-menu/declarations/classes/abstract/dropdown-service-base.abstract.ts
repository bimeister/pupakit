import { Uuid } from '../../../../../../internal/declarations/types/uuid.type';
import { ElementRef, TemplateRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Nullable } from '@bimeister/utilities';
import { DropdownBase } from './dropdown-base.abstract';
import { DropdownsStore } from '../dropdowns-store.class';

export abstract class DropdownServiceBase<DropdownClass extends DropdownBase<unknown>> {
  protected dropdownsStore: DropdownsStore<DropdownClass> = new DropdownsStore<DropdownClass>();

  protected closeAllDropdowns(): void {
    this.dropdownsStore.getDropdownIds().forEach((id: Uuid) => {
      this.dropdownsStore.getDropdown(id).setIsOpen(false);
    });
  }

  public registerDropdown(id: Uuid, dropdown: DropdownClass): void {
    this.dropdownsStore.registerDropdown(id, dropdown);
  }

  public unregisterDropdown(id: Uuid): void {
    this.dropdownsStore.unregisterDropdown(id);
  }

  public setDropdownTemplate(id: Uuid, template: TemplateRef<unknown>): void {
    if (!this.dropdownsStore.doesDropdownExists(id)) {
      return;
    }

    this.dropdownsStore.getDropdown(id).setContentTemplate(template);
  }

  public setDropdownIsOpen(id: Uuid, isOpen: boolean): void {
    if (!this.dropdownsStore.doesDropdownExists(id)) {
      return;
    }

    if (isOpen) {
      this.closeAllDropdowns();
    }

    this.dropdownsStore.getDropdown(id).setIsOpen(isOpen);
  }

  public setDropdownTriggerRef(id: Uuid, triggerRef: ElementRef<HTMLElement>): void {
    if (!this.dropdownsStore.doesDropdownExists(id)) {
      return;
    }

    this.dropdownsStore.getDropdown(id).setTriggerRef(triggerRef);
  }

  public getDropdownTemplate(id: Uuid): Observable<Nullable<TemplateRef<unknown>>> {
    if (!this.dropdownsStore.doesDropdownExists(id)) {
      return of(null);
    }

    return this.dropdownsStore.getDropdown(id).contentTemplate$;
  }

  public getDropdownIsOpen(id: Uuid): Observable<boolean> {
    if (!this.dropdownsStore.doesDropdownExists(id)) {
      return of(false);
    }

    return this.dropdownsStore.getDropdown(id).isOpen$;
  }
}

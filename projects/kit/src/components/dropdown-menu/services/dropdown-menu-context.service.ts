import { Injectable } from '@angular/core';
import { DropdownRef } from '../../../declarations/classes/dropdown-ref.class';

@Injectable()
export class DropdownMenuContextService {
  private currentDropdownRef: DropdownRef | null = null;

  public setDropdownRef(dropdownRef: DropdownRef | null): void {
    this.currentDropdownRef = dropdownRef;
  }

  public closeDropdown(): void {
    this.currentDropdownRef?.close();
  }
}

import { Uuid } from '../../../../../internal/declarations/types/uuid.type';
import { isEmpty, isNil } from '@bimeister/utilities';

interface DropdownsTable<DropdownClass> {
  [key: string]: DropdownClass;
}

export class DropdownsStore<DropdownClass> {
  protected dropdownsTable: DropdownsTable<DropdownClass> = {};

  public doesDropdownExists(id: Uuid): boolean {
    return !isEmpty(this.dropdownsTable) && !isNil(this.dropdownsTable?.[id]);
  }

  public getDropdown(id: Uuid): DropdownClass {
    return this.dropdownsTable[id];
  }

  public getDropdownIds(): Uuid[] {
    return Object.keys(this.dropdownsTable);
  }

  public registerDropdown(id: Uuid, dropdown: DropdownClass): void {
    this.dropdownsTable[id] = dropdown;
  }

  public unregisterDropdown(id: Uuid): void {
    this.dropdownsTable = Object.fromEntries(
      Object.entries(this.dropdownsTable).filter(([dropdownId]: [Uuid, DropdownClass]) => dropdownId !== id)
    );
  }
}

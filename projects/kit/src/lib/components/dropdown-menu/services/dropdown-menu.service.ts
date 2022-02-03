import { Injectable } from '@angular/core';
import { DropdownServiceBase } from '../declarations/classes/abstract/dropdown-service-base.abstract';
import { HorizontalConnectionPos } from '@angular/cdk/overlay';
import { DropdownMenu } from '../declarations/classes/dropdown-menu.class';
import { Uuid } from '../../../../internal/declarations/types/uuid.type';

@Injectable({
  providedIn: 'root',
})
export class DropdownMenuService extends DropdownServiceBase<DropdownMenu> {
  public setDropdownHorizontalPosition(id: Uuid, position: HorizontalConnectionPos): void {
    if (!this.dropdownsStore.doesDropdownExists(id)) {
      return;
    }

    this.dropdownsStore.getDropdown(id).setContentHorizontalPosition(position);
  }
}

import { HorizontalConnectionPos } from '@angular/cdk/overlay';
import { DropdownMenuService as DropdownMenuServiceInterface } from '@kit/internal/declarations/interfaces/dropdown-menu-service.interface';
import { Uuid } from '../../../../internal/declarations/types/uuid.type';
import { DropdownServiceBase } from '../declarations/classes/abstract/dropdown-service-base.abstract';
import { DropdownMenu } from '../declarations/classes/dropdown-menu.class';

export class DropdownMenuService extends DropdownServiceBase<DropdownMenu> implements DropdownMenuServiceInterface {
  public setDropdownHorizontalPosition(id: Uuid, position: HorizontalConnectionPos): void {
    if (!this.dropdownsStore.doesDropdownExists(id)) {
      return;
    }

    this.dropdownsStore.getDropdown(id).setContentHorizontalPosition(position);
  }
}

import { Observable } from 'rxjs';
import { DropdownRef } from './dropdown-ref.class';

export class OpenedDropdown {
  public readonly closed$: Observable<void> = this.dropdownRef.closed$;

  constructor(public readonly id: string, private readonly dropdownRef: DropdownRef) {}

  public close(): void {
    this.dropdownRef.close();
  }
}

import { DropdownDirectiveParams } from './dropdown-directive-params.interface';

export interface DropdownHost {
  setDropdownParams(params: DropdownDirectiveParams): void;
}

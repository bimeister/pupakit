import { DropdownComponentBase } from '../../classes/abstract/dropdown-component-base.abstract';

export type DropdownDataType<C extends DropdownComponentBase<unknown>> = C extends DropdownComponentBase<infer D>
  ? D
  : never;

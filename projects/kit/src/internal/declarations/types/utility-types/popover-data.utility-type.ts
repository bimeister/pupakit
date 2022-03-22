import { PopoverComponentBase } from '../../classes/abstract/popover-component-base.abstract';

export type PopoverDataType<C extends PopoverComponentBase<unknown, unknown>> = C extends PopoverComponentBase<
  infer D,
  unknown
>
  ? D
  : never;

import { PopoverComponentBase } from '../../classes/abstract/popover-component-base.abstract';

export type PopoverReturnType<C extends PopoverComponentBase<unknown, unknown>> = C extends PopoverComponentBase<
  unknown,
  infer D
>
  ? D
  : never;

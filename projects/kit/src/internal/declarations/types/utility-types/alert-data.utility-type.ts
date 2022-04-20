import { AlertComponentBase } from '../../classes/abstract/alert-component-base.abstract';

export type AlertDataType<C extends AlertComponentBase<unknown, unknown>> = C extends AlertComponentBase<
  infer D,
  unknown
>
  ? D
  : never;

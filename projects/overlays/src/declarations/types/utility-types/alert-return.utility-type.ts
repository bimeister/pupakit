import { AlertComponentBase } from '../../classes/abstract/alert-component-base.abstract';

export type AlertReturnType<C extends AlertComponentBase<unknown, unknown>> = C extends AlertComponentBase<
  unknown,
  infer R
>
  ? R
  : never;

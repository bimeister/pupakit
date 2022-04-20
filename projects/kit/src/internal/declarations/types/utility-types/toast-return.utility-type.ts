import { ToastComponentBase } from '../../classes/abstract/toast-component-base.abstract';

export type ToastReturnType<C extends ToastComponentBase<unknown, unknown>> = C extends ToastComponentBase<
  unknown,
  infer R
>
  ? R
  : never;

import { ToastComponentBase } from '../../classes/abstract/toast-component-base.abstract';

export type ToastDataType<C extends ToastComponentBase<unknown, unknown>> = C extends ToastComponentBase<
  infer D,
  unknown
>
  ? D
  : never;

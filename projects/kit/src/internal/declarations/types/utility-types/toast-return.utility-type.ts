import { ToastComponentBase } from '../../classes/abstract/toast-component-base.abstract';
import { ObservableValueType } from './observable-value.utility-type';

export type ToastReturnType<C extends ToastComponentBase<unknown, unknown>> = ObservableValueType<
  C['toastRef']['closed$']
>;

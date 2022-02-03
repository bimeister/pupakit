import { ToastComponentBase } from '../../classes/abstract/toast-component-base.abstract';

export type ToastDataType<C extends ToastComponentBase<unknown, unknown>> = C['toastRef']['config']['data'];

import { AlertComponentBase } from '../../classes/abstract/alert-component-base.abstract';
import { ObservableValueType } from './observable-value.utility-type';

export type AlertReturnType<C extends AlertComponentBase<unknown, unknown>> = ObservableValueType<
  C['alertRef']['closed$']
>;

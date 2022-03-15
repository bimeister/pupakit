import { PopoverComponentBase } from '../../classes/abstract/popover-component-base.abstract';
import { ObservableValueType } from './observable-value.utility-type';

export type PopoverReturnType<C extends PopoverComponentBase<unknown, unknown>> = ObservableValueType<
  C['popoverRef']['closed$']
>;

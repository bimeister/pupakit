import { PopoverComponentBase } from '../../classes/abstract/popover-component-base.abstract';

export type PopoverDataType<C extends PopoverComponentBase<unknown, unknown>> = C['popoverRef']['config']['data'];

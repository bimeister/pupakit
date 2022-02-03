import { AlertComponentBase } from '../../classes/abstract/alert-component-base.abstract';

export type AlertDataType<C extends AlertComponentBase<unknown, unknown>> = C['alertRef']['config']['data'];

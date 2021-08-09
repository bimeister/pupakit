import { ControllerOptions } from './controller-options.interface';

export interface TableControllerOptions<T> extends ControllerOptions<T> {
  rowHeightPx?: number;
}

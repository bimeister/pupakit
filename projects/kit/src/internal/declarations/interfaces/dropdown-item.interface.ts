import { IconData } from './icon-data.interface';

export interface DropdownItem<T> {
  caption: string;
  iconLeft?: IconData;
  iconRight?: IconData;
  children?: DropdownItem<T>[];
  data: T;
}

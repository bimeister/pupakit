interface IconData {
  name?: string;
  src?: string;
  color?: string;
}

export interface DropdownItem<T> {
  caption: string;
  iconLeft?: IconData;
  iconRight?: IconData;
  data: T;
}

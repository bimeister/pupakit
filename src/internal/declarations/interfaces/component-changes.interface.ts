import { ComponentChange } from './component-change.interface';

export type ComponentChanges<T, K extends keyof T = keyof T> = {
  [P in K]: ComponentChange<T, T[P]>;
};

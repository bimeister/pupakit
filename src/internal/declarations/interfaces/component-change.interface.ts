import { SimpleChange } from '@angular/core';

export interface ComponentChange<T, K = T[keyof T]> extends SimpleChange {
  previousValue: K;
  currentValue: K;
}

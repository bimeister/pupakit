import { Nullable } from '@bimeister/utilities/common';

export interface StepperItem<T> {
  /** @deprecated why not string? */
  name: T;
  isActive: Nullable<boolean>;
  disabled: Nullable<boolean>;
}

import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';

export interface AlertConfig<TComponent, TData> {
  data: TData;
  component?: ComponentType<TComponent>;
  injector?: Injector;
}

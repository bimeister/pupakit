import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';

export interface ToastConfig<TComponent, TData> {
  component?: ComponentType<TComponent>;
  data: TData;
  injector?: Injector;
}

import { Injector, Type } from '@angular/core';

export interface ComponentToRender {
  component: Type<unknown>;
  injector: Injector;
}

import { ComponentType } from '@angular/cdk/portal';
import { ElementRef, Injector } from '@angular/core';
import { Position } from '@bimeister/pupakit.common';

export interface PopoverConfig<TComponent, TData> {
  data: TData;
  component: ComponentType<TComponent>;
  anchor: ElementRef<HTMLElement> | Position;
  injector?: Injector;
  hasBackdrop: boolean;
}

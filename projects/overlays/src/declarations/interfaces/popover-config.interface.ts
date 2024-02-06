import { ComponentType } from '@angular/cdk/portal';
import { ElementRef, Injector } from '@angular/core';
import { Position } from '@bimeister/pupakit.common';
import { PopoverTrigger } from './popover-trigger.interface';

export interface PopoverConfig<TComponent, TData> {
  data: TData;
  component: ComponentType<TComponent>;
  anchor: ElementRef<HTMLElement> | Position;
  trigger?: PopoverTrigger;
  injector?: Injector;
  autoCloseTimeout?: number;
  hasBackdrop: boolean;
}

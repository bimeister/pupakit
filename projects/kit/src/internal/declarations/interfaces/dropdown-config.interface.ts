import { ComponentType } from '@angular/cdk/portal';
import { ElementRef, Injector } from '@angular/core';
import { DropdownWidthType } from '../../declarations/types/dropdown-width.type';
import { Position } from '../types/position.type';

export interface DropdownConfig<TComponent, TData> {
  target: ElementRef<HTMLElement> | Position;
  widthType: DropdownWidthType;
  data?: TData;
  component?: ComponentType<TComponent>;
  injector?: Injector;
}

import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { Position, Theme } from '@bimeister/pupakit.common';
import { DropdownWidthType } from '../../declarations/types/dropdown-width.type';
import { DropdownMenuPosition } from '../types/dropdown-menu-position.type';

export interface DropdownConfig<TComponent, TData> {
  target: HTMLElement | Position;
  widthType: DropdownWidthType;
  data?: TData;
  component?: ComponentType<TComponent>;
  injector?: Injector;
  theme?: Theme;
  position?: DropdownMenuPosition;
}

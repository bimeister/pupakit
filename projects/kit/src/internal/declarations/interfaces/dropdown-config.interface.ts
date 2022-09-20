import { HorizontalConnectionPos } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { DropdownWidthType } from '../../declarations/types/dropdown-width.type';
import { Theme } from '../enums/theme.enum';
import { Position } from '../types/position.type';

export interface DropdownConfig<TComponent, TData> {
  target: HTMLElement | Position;
  widthType: DropdownWidthType;
  horizontalPosition: HorizontalConnectionPos;
  data?: TData;
  component?: ComponentType<TComponent>;
  injector?: Injector;
  theme?: Theme;
}

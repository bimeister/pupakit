import { HorizontalConnectionPos, VerticalConnectionPos } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { Position, Theme } from '@bimeister/pupakit.common';
import { DropdownWidthType } from '../../declarations/types/dropdown-width.type';

export interface DropdownConfig<TComponent, TData> {
  target: HTMLElement | Position;
  widthType: DropdownWidthType;
  horizontalPosition: HorizontalConnectionPos;
  verticalPosition: VerticalConnectionPos;
  data?: TData;
  component?: ComponentType<TComponent>;
  injector?: Injector;
  theme?: Theme;
}

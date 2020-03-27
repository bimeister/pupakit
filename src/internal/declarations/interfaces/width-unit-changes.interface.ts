import { SimpleChange } from '@angular/core';

export interface WidthUnitChanges {
  width?: SimpleChange;
  widthPx?: SimpleChange;
  widthVw?: SimpleChange;
  widthVh?: SimpleChange;
  widthRem?: SimpleChange;
  widthPercents?: SimpleChange;
}

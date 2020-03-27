import { SimpleChange } from '@angular/core';

export interface HeightUnitChanges {
  height?: SimpleChange;
  heightPx?: SimpleChange;
  heightVw?: SimpleChange;
  heightVh?: SimpleChange;
  heightRem?: SimpleChange;
  heightPercents?: SimpleChange;
}

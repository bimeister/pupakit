import { TemplateRef } from '@angular/core';

export interface DndCloneData<T = unknown> {
  templateRef: TemplateRef<T>;
  templateContext: T;
  widthPx?: number;
  heightPx?: number;
}

import { TemplateRef } from '@angular/core';

export interface DndCloneContainerData<C> {
  templateRef: TemplateRef<C>;
  templateContext: C;
}

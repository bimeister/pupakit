import { ChangeDetectionStrategy, Component, Inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { DND_CLONE_CONTAINER_DATA_TOKEN } from '../../../../declarations/tokens/dnd-clone-container-data.token';
import { DndCloneContainerData } from '../../../../declarations/interfaces/dnd-clone-container-data.interface';

@Component({
  selector: 'pupa-dnd-clone-container',
  templateUrl: './dnd-clone-container.component.html',
  styleUrls: ['./dnd-clone-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DndCloneContainerComponent<C> {
  public readonly templateRef: TemplateRef<C> = this.data.templateRef;
  public readonly templateContext: C = this.data.templateContext;

  constructor(@Inject(DND_CLONE_CONTAINER_DATA_TOKEN) private readonly data: DndCloneContainerData<C>) {}
}

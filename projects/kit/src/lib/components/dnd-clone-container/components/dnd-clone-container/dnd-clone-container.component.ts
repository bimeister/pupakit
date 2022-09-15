import { ChangeDetectionStrategy, Component, Inject, Optional, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ThemeWrapperService } from '../../../theme-wrapper/services/theme-wrapper.service';
import { Observable, of } from 'rxjs';
import { DND_CLONE_CONTAINER_DATA_TOKEN } from '../../../../../internal/constants/tokens/dnd-clone-container-data.token';
import { DndCloneContainerData } from '../../../../../internal/declarations/interfaces/dnd-clone-container-data.interface';

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

  public readonly themeClass$: Observable<string> = this.themeWrapperService?.themeClass$ ?? of('');
  public readonly theme$: Observable<string> = this.themeWrapperService?.theme$;

  constructor(
    @Inject(DND_CLONE_CONTAINER_DATA_TOKEN) private readonly data: DndCloneContainerData<C>,
    @Optional() private readonly themeWrapperService: ThemeWrapperService
  ) {}
}

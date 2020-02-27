import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DroppableConfig } from '../../../../internal/declarations/interfaces/droppable-config.interface';
import { isNullOrUndefined } from '../../../../internal/helpers/is-null-or-undefined.helper';

@Injectable({
  providedIn: 'root'
})
export class DroppableService {
  private readonly droppableContentState$: BehaviorSubject<DroppableConfig> = new BehaviorSubject<DroppableConfig>(
    null
  );

  public readonly isOpened$: Observable<boolean> = this.droppableContentState$.pipe(
    map((droppableContent: DroppableConfig) => !isNullOrUndefined(droppableContent))
  );
  public readonly droppableContent$: Observable<DroppableConfig> = this.droppableContentState$;

  public open(droppableContent: DroppableConfig): void {
    this.droppableContentState$.next(droppableContent);
  }
  public close(): void {
    this.droppableContentState$.next(null);
  }
}

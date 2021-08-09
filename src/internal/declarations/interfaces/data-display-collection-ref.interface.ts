import { TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';

export interface DataDisplayCollectionRef<T> {
  readonly trackBy$: Observable<TrackByFunction<T>>;
  readonly scrollBehavior$: Observable<ScrollBehavior>;
  readonly data$: Observable<T[]>;
  readonly selectedIdsList$: Observable<string[]>;

  setData(data: T[]): Observable<T[]>;
  setSelectedIdsList(value: string[]): void;
}

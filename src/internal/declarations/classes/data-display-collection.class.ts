import { TrackByFunction } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataDisplayCollectionRef } from '../interfaces/data-display-collection-ref.interface';

export class DataDisplayCollection<T> implements DataDisplayCollectionRef<T> {
  public readonly data$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public readonly selectedIdsList$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  public readonly trackBy$: Subject<TrackByFunction<T>> = new BehaviorSubject(DataDisplayCollection.trackBy);
  public readonly scrollBehavior$: BehaviorSubject<ScrollBehavior> = new BehaviorSubject('smooth');

  public setData(data: T[]): Observable<T[]> {
    this.data$.next(data);
    return this.data$.pipe(take(1));
  }

  public setSelectedIdsList(value: string[]): void {
    this.selectedIdsList$.next(value);
  }

  public static trackBy<T>(index: number, dataItem: T): string {
    if (isNil(dataItem)) {
      return `${index}__null`;
    }
    return `${index}__${JSON.stringify(dataItem)}`;
  }
}

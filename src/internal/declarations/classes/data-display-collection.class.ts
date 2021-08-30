import { TrackByFunction } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataDisplayCollectionRef } from '../interfaces/data-display-collection-ref.interface';
import { FlatTreeItem } from './flat-tree-item.class';

export class DataDisplayCollection implements DataDisplayCollectionRef {
  public readonly data$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);
  public readonly selectedIdsList$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public readonly trackBy$: Subject<TrackByFunction<FlatTreeItem>> = new BehaviorSubject(DataDisplayCollection.trackBy);
  public readonly scrollBehavior$: BehaviorSubject<ScrollBehavior> = new BehaviorSubject('smooth');
  public readonly hasDragAndDrop$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public setData(data: FlatTreeItem[]): Observable<FlatTreeItem[]> {
    this.data$.next(data);
    return this.data$.pipe(take(1));
  }

  public setSelectedIdsList(value: string[]): void {
    this.selectedIdsList$.next(value);
  }

  public setIsLoading(value: boolean): void {
    this.isLoading$.next(value);
  }

  public static trackBy(index: number, treeItem: FlatTreeItem): string {
    if (isNil(treeItem)) {
      return `${index}__null_null_null_null`;
    }
    const { id, isExpandable, level, name }: FlatTreeItem = treeItem;
    return `${index}__${id}_${isExpandable}_${level}_${name}`;
  }
}

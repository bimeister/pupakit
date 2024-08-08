import { TrackByFunction } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { DEFAULT_TREE_ITEM_SIZE_REM } from '../constants/default-tree-item-size-rem.const';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { TreeDataDisplayCollectionRef } from '../interfaces/tree-data-display-collection-ref.interface';
import { FlatTreeItem } from './flat-tree-item.class';

export class TreeDataDisplayCollection implements TreeDataDisplayCollectionRef {
  public readonly data$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);
  public readonly selectedIdsList$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  public readonly trackBy$: Subject<TrackByFunction<FlatTreeItem>> = new BehaviorSubject<TrackByFunction<FlatTreeItem>>(
    TreeDataDisplayCollection.trackBy
  );
  public readonly scrollBehavior$: BehaviorSubject<ScrollBehavior> = new BehaviorSubject('smooth');
  public readonly expandedIdsList$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  public readonly hasDragAndDrop$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly treeItemSizeRem$: BehaviorSubject<number> = new BehaviorSubject(DEFAULT_TREE_ITEM_SIZE_REM);
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public setExpandedIdsList(value: string[]): void {
    this.expandedIdsList$.next(value);
  }

  public setIsLoading(value: boolean): void {
    this.isLoading$.next(value);
  }

  public setData(data: FlatTreeItem[]): Observable<FlatTreeItem[]> {
    this.data$.next(data);
    return this.data$.pipe(take(1));
  }

  public setSelectedIdsList(value: string[]): void {
    this.selectedIdsList$.next(value);
  }

  public static readonly trackBy: TrackByFunction<any> = <T>(index: number, dataItem: T): string => {
    if (isNil(dataItem)) {
      return `${index}__null`;
    }
    return `${index}__${JSON.stringify(dataItem)}`;
  };
}

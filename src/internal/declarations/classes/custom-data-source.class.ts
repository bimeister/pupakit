import { ListRange } from '@angular/cdk/collections';
import { isNil, shareReplayWithRefCount } from '@meistersoft/utilities';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TreeDataSource } from '../interfaces/tree-data-source.interface';
import { FlatTreeItem } from './flat-tree-item.class';

export class CustomTreeDataSource implements TreeDataSource {
  public readonly sortedData$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject([]);
  public readonly disconnect$: Subject<void> = new Subject<void>();

  public readonly currentSlice$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);
  public readonly filteredData$: BehaviorSubject<FlatTreeItem[]> = new BehaviorSubject<FlatTreeItem[]>([]);

  constructor(
    public readonly expandedItemIds$: Observable<Set<string>>,
    public readonly activeRange$: Observable<ListRange>,
    public readonly hideRoot$: Observable<boolean>
  ) {}

  public connect(): Observable<FlatTreeItem[]> {
    return combineLatest([this.filteredData$, this.activeRange$]).pipe(
      filter(
        ([filteredData, activeRange]: [FlatTreeItem[], ListRange]) => Array.isArray(filteredData) && !isNil(activeRange)
      ),
      map(([filteredData, activeRange]: [FlatTreeItem[], ListRange]) => {
        const { start, end }: ListRange = activeRange;
        return filteredData.slice(start, end);
      }),
      shareReplayWithRefCount()
    );
  }

  public disconnect(): void {
    this.disconnect$.next();
  }

  public setFilteredData(data: FlatTreeItem[]): void {
    this.filteredData$.next(data);
    this.sortedData$.next(data);
  }
}

import { DataSource, ListRange } from '@angular/cdk/collections';
import { isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { FlatTreeItem } from './flat-tree-item.class';

export class TreeRangedDataSource extends DataSource<FlatTreeItem> {
  private readonly range$: BehaviorSubject<ListRange> = new BehaviorSubject(null);

  constructor(private readonly data$: Observable<FlatTreeItem[]>) {
    super();
  }

  public setRange(range: ListRange): void {
    this.range$.next(range);
  }

  public connect(): Observable<FlatTreeItem[]> {
    return combineLatest([this.data$, this.range$]).pipe(
      filter(([data, range]: [FlatTreeItem[], ListRange]) => Array.isArray(data) && !isNil(range)),
      map(([data, range]: [FlatTreeItem[], ListRange]) => {
        const { start, end }: ListRange = range;
        return data.slice(start, end);
      }),
      shareReplayWithRefCount()
    );
  }

  public disconnect(): void {
    return;
  }
}

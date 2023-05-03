import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filterNotNil } from '@bimeister/utilities';
import { takeUntil } from 'rxjs/operators';

export class TableBodyRowsDataSource<T> extends DataSource<T> {
  public readonly listRange$: ReplaySubject<ListRange> = new ReplaySubject<ListRange>(1);
  private readonly unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly data$: Observable<T[]>) {
    super();
  }

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    collectionViewer.viewChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((listRange: ListRange) => this.listRange$.next(listRange));
    return this.data$.pipe(filterNotNil());
  }

  public disconnect(_collectionViewer: CollectionViewer): void {
    this.unsubscribe$.next();
  }

  public setInitialListRange(listRange: ListRange): void {
    this.listRange$.next(listRange);
  }
}

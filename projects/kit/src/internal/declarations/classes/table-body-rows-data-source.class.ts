import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { ReplaySubject, Observable, Subscription } from 'rxjs';
import { filterNotNil } from '@bimeister/utilities';
import { distinctUntilChanged, filter, map, skip } from 'rxjs/operators';

export class TableBodyRowsDataSource<T> extends DataSource<T> {
  public readonly listRange$: ReplaySubject<ListRange> = new ReplaySubject<ListRange>(1);
  private subscription: Subscription | null;

  private skipNextListRangeChange: boolean = false;

  constructor(private readonly data$: Observable<T[]>) {
    super();
  }

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this.subscription = new Subscription();

    const subscription: Subscription = collectionViewer.viewChange
      .pipe(
        filter(() => {
          if (this.skipNextListRangeChange) {
            this.skipNextListRangeChange = false;
            return false;
          }

          return true;
        })
      )
      .subscribe((listRange: ListRange) => {
        this.listRange$.next(listRange);
      });

    this.subscription.add(subscription);
    this.subscription.add(this.processTotalChanges());

    return this.data$.pipe(filterNotNil());
  }

  public disconnect(_collectionViewer: CollectionViewer): void {
    this.subscription?.unsubscribe();
  }

  public setInitialListRange(listRange: ListRange): void {
    this.listRange$.next(listRange);
  }

  public reset(): void {
    this.skipNextListRangeChange = false;
  }

  private processTotalChanges(): Subscription {
    return this.data$
      .pipe(
        map((data: T[]) => data.length),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(() => {
        this.skipNextListRangeChange = true;
      });
  }
}

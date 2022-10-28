import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { ReplaySubject, Observable, Subscription } from 'rxjs';
import { filterNotNil } from '@bimeister/utilities';

export class TableBodyRowsDataSource<T> extends DataSource<T> {
  public readonly listRange$: ReplaySubject<ListRange> = new ReplaySubject<ListRange>(1);
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly data$: Observable<T[]>) {
    super();
  }

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    const subscription: Subscription = collectionViewer.viewChange.subscribe((listRange: ListRange) => {
      this.listRange$.next(listRange);
    });
    this.subscription.add(subscription);
    return this.data$.pipe(filterNotNil());
  }

  public disconnect(_collectionViewer: CollectionViewer): void {
    this.subscription.unsubscribe();
  }

  public setInitialListRange(listRange: ListRange): void {
    this.listRange$.next(listRange);
  }
}

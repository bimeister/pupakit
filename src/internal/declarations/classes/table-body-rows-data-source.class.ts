import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filterNotNil } from '@bimeister/utilities';

export class TableBodyRowsDataSource<T> extends DataSource<T> {
  public readonly listRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>({
    start: 0,
    end: 0,
  });
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
}

import { CollectionViewer, DataSource, ListRange, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';

export class FlatDataSource<T, F> extends DataSource<F> {
  public readonly flattenedData: BehaviorSubject<F[]> = new BehaviorSubject<F[]>([]);
  public readonly expandedData: BehaviorSubject<F[]> = new BehaviorSubject<F[]>([]);

  private readonly data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>(this.initialData);

  constructor(
    private readonly treeControl: FlatTreeControl<F>,
    private readonly treeFlattener: MatTreeFlattener<T, F>,
    private readonly initialData: T[] = []
  ) {
    super();
  }

  public connect(collectionViewer: CollectionViewer): Observable<F[]> {
    const changes: Observable<ListRange | SelectionChange<F> | F[]>[] = [
      collectionViewer.viewChange,
      this.treeControl.expansionModel.changed,
      this.flattenedData
    ];
    return merge(...changes).pipe(
      mapTo(this.treeControl),
      withLatestFrom(this.flattenedData),
      map(([treeControl, flattenedData]: [FlatTreeControl<F>, F[]]) =>
        this.treeFlattener.expandFlattenedNodes(flattenedData, treeControl)
      ),
      tap((flatTreeNodes: F[]) => this.expandedData.next(flatTreeNodes))
    );
  }

  public disconnect(): void {
    return;
  }

  public setData(data: T[]): void {
    this.flattenedData.pipe(take(1)).subscribe((flattenedData: F[]) => {
      this.data.next(data);
      this.flattenedData.next(this.treeFlattener.flattenNodes(data));
      this.treeControl.dataNodes = flattenedData;
    });
  }
}

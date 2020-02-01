import { CollectionViewer, DataSource, ListRange, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map, mapTo, take, tap, withLatestFrom } from 'rxjs/operators';

/** @deprecated unstable */
export class NestedTreeDataSource<T, F> extends DataSource<F> {
  public readonly flattenedData: BehaviorSubject<F[]> = new BehaviorSubject<F[]>([]);
  public readonly expandedData: BehaviorSubject<F[]> = new BehaviorSubject<F[]>([]);

  private readonly data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>(this.initialData);

  constructor(
    private readonly treeControl: FlatTreeControl<F>,
    private readonly isExpandable: (node: F) => boolean,
    private readonly getLevel: (node: F) => number,
    private readonly transformFunction: (node: T, level: number) => F,
    private readonly getChildren: (node: T) => Observable<T[]>,
    private readonly dataIsFlat: boolean = false,
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
        this.expandFlattenedNodes(flattenedData, treeControl)
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
      this.flattenedData.next(this.flattenNodes(data));
      this.treeControl.dataNodes = flattenedData;
    });
  }

  private expandFlattenedNodes(nodes: F[], treeControl: TreeControl<F>): F[] {
    const results: F[] = [];
    const currentExpand: boolean[] = [];
    currentExpand[0] = true;

    nodes.forEach(node => {
      let expand: boolean = true;
      for (let i: number = 0; i <= this.getLevel(node); i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (this.isExpandable(node)) {
        currentExpand[this.getLevel(node) + 1] = treeControl.isExpanded(node);
      }
    });
    return results;
  }

  private flattenNodes(structuredData: T[]): F[] {
    if (this.dataIsFlat) {
      return (structuredData as any) as F[];
    }
    const resultNodes: F[] = [];
    structuredData.forEach(node => this.nodeFlattener(node, 0, resultNodes, []));
    return resultNodes;
  }

  private nodeFlattener(node: T, level: number, resultNodes: F[], parentMap: boolean[]): F[] {
    const flatNode: F = this.transformFunction(node, level);
    resultNodes.push(flatNode);

    if (this.isExpandable(flatNode)) {
      const childrenNodes: Observable<T[]> = this.getChildren(node);
      if (childrenNodes) {
        if (Array.isArray(childrenNodes)) {
          this.flattenChildren(childrenNodes, level, resultNodes, parentMap);
        } else {
          childrenNodes.pipe(take(1)).subscribe(children => {
            this.flattenChildren(children, level, resultNodes, parentMap);
          });
        }
      }
    }
    return resultNodes;
  }

  private flattenChildren(children: T[], level: number, resultNodes: F[], parentMap: boolean[]): void {
    children.forEach((child, index) => {
      const childParentMap: boolean[] = parentMap.slice();
      childParentMap.push(index !== children.length - 1);
      this.nodeFlattener(child, level + 1, resultNodes, childParentMap);
    });
  }
}

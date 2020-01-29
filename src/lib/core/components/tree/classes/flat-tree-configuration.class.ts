import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

import { FlatTreeItem } from './flat-tree-item.class';
import { TreeConfiguration } from './tree-configuration.class';
import { TreeItem } from './tree-item.class';

export class FlatTreeConfiguration extends TreeConfiguration {
  public readonly dataSource: DataSource<FlatTreeItem> = null;

  constructor(protected readonly dataOrigin: Observable<FlatTreeItem[]>) {
    super(dataOrigin);
  }

  public setSourceData(data: TreeItem[] | FlatTreeItem[]): void {
    // tslint:disable-next-line: restrict-plus-operands
    throw new Error('Method not implemented. ' + data);
  }

  public getSourceData(): Observable<TreeItem[]> | Observable<FlatTreeItem[]> {
    throw new Error('Method not implemented.');
  }
}

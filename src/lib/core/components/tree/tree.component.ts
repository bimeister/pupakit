import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of } from 'rxjs';

export class TreeItem {
  constructor(public name: string, public children?: TreeItem[]) {}
}

export class FlatTreeItem {
  constructor(public readonly isExpandable: boolean, public name: string, public level: number) {}
}

@Component({
  selector: 'pupa-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport, { static: true }) private readonly virtualScroll: CdkVirtualScrollViewport;

  @Input() public dataOrigin: TreeItem[] = [];

  public readonly treeControl: FlatTreeControl<FlatTreeItem> = new FlatTreeControl<FlatTreeItem>(
    TreeComponent.getLevel,
    TreeComponent.isExpandable
  );

  public readonly treeFlattener: MatTreeFlattener<TreeItem, FlatTreeItem> = new MatTreeFlattener(
    TreeComponent.transformer,
    TreeComponent.getLevel,
    TreeComponent.isExpandable,
    TreeComponent.getChildren
  );

  public readonly dataSource: MatTreeFlatDataSource<TreeItem, FlatTreeItem> = new MatTreeFlatDataSource<
    TreeItem,
    FlatTreeItem
    // tslint:disable-next-line: no-magic-numbers
  >(this.treeControl, this.treeFlattener, this.dataOrigin.slice(0, 20));

  public ngAfterViewInit(): void {
    this.virtualScroll.renderedRangeStream.subscribe((range: ListRange) => {
      // tslint:disable-next-line: no-console
      console.log(range);
      this.dataSource.data = this.dataOrigin.slice(range.start, range.end);
    });
  }

  public readonly hasChild = (_: number, node: FlatTreeItem): boolean => node.isExpandable;

  private static transformer(node: TreeItem, level: number): FlatTreeItem {
    return new FlatTreeItem(Array.isArray(node.children), node.name, level);
  }

  private static getLevel(node: FlatTreeItem): number {
    return node.level;
  }

  private static isExpandable(node: FlatTreeItem): boolean {
    return node.isExpandable;
  }

  private static getChildren(node: TreeItem): Observable<TreeItem[]> {
    return of(node.children);
  }
}

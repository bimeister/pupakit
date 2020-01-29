import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { filter, map, startWith, withLatestFrom } from 'rxjs/operators';

import {
  FlatTreeConfiguration,
  FlatTreeItem,
  NestedTreeConfiguration,
  TreeConfiguration,
  TreeItem
} from '../../../src/lib/core/components/tree/classes';
import { isNullOrUndefined } from './../../../src/lib/helpers/is-null-or-undefined.helper';
import { flatSource } from './flat-source.const';

@Component({
  selector: 'demo-tree-demo',
  templateUrl: './tree-demo.component.html',
  styleUrls: ['./tree-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDemoComponent {
  public isFlatTreeUsed: boolean = false;

  public readonly depthControl: FormControl = new FormControl(1);
  // tslint:disable-next-line: no-magic-numbers
  public readonly sizeControl: FormControl = new FormControl(10);

  private readonly aggregatedRow$: Observable<TreeItem> = this.depthControl.valueChanges.pipe(
    startWith(this.depthControl.value),
    // tslint:disable-next-line: no-magic-numbers
    map((controlValue: string) => Number.parseInt(controlValue, 10)),
    filter((depth: number) => depth > 0),
    map((depth: number) =>
      new Array(depth)
        .fill(null)
        .map((_, index: number) => new TreeItem(`level (${index + 1})`, []))
        .reduce(
          (previousValue: TreeItem, currentValue: TreeItem) =>
            isNullOrUndefined(previousValue)
              ? currentValue
              : {
                  ...currentValue,
                  children: [previousValue]
                },
          null
        )
    )
  );

  private readonly allResultRows$: Observable<TreeItem[]> = this.sizeControl.valueChanges.pipe(
    startWith(this.sizeControl.value),
    // tslint:disable-next-line: no-magic-numbers
    map((controlValue: string) => Number.parseInt(controlValue, 10)),
    filter((depth: number) => depth > 0),
    withLatestFrom(this.aggregatedRow$),
    map(([size, aggregatedRow]: [number, TreeItem]) =>
      new Array(size)
        .fill(aggregatedRow)
        .map((rowRootItem: TreeItem, index: number) => ({ ...rowRootItem, name: `${index + 1} – ${rowRootItem.name}` }))
    )
  );

  private readonly nestedSource$: Observable<TreeItem[]> = this.allResultRows$;

  private readonly flatSource$: Observable<FlatTreeItem[]> = of(flatSource);

  public readonly treeConfiguration: TreeConfiguration = new NestedTreeConfiguration(this.nestedSource$);
  public readonly flatTreeConfiguration: TreeConfiguration = new FlatTreeConfiguration(this.flatSource$);
}

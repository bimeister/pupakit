import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getUuid } from '@meistersoft/utilities';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { FlatTreeItem } from '../../../src/internal/declarations/classes/flat-tree-item.class';

@Component({
  selector: 'demo-tree',
  styleUrls: ['../demo.scss', './tree-demo.component.scss'],
  templateUrl: './tree-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDemoComponent {
  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public readonly leafElementsCount: number = 1000;
  public readonly dataOrigin: FlatTreeItem[] = [
    new FlatTreeItem(true, 'Wolves', 0, null),
    ...new Array(this.leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `🐺 ${index + 1}`, 1, null)),
    new FlatTreeItem(true, 'Cars', 0, null),
    ...new Array(this.leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `🚗 ${index + 1}`, 1, null)),
    new FlatTreeItem(true, 'Burgers', 0, null),
    ...new Array(this.leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `🍔 ${index + 1}`, 1, null)),
    new FlatTreeItem(true, 'Faces', 0, null),
    new FlatTreeItem(true, 'Happy', 1, null),
    ...new Array(this.leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `😀 ${index + 1}`, 2, null)),
    new FlatTreeItem(true, 'Sad', 1, null),
    ...new Array(this.leafElementsCount)
      .fill(null)
      .map((_, index: number) => new FlatTreeItem(false, `😥 ${index + 1}`, 2, null)),
    new FlatTreeItem(false, '🐵', 1, null),
    new FlatTreeItem(false, '🙊', 1, null),
    new FlatTreeItem(false, '🙉', 1, null),
    new FlatTreeItem(false, '🙈', 1, null)
  ].map((item: FlatTreeItem) => ({ ...item, id: getUuid() }));

  public toggleLoader(): void {
    this.isLoading$.pipe(take(1)).subscribe((isLoading: boolean) => {
      this.isLoading$.next(!isLoading);
    });
  }
}

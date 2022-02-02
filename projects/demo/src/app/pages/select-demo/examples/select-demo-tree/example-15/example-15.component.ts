import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getUuid } from '@bimeister/utilities';
import { FlatTreeItem } from '@kit/internal/declarations/classes/flat-tree-item.class';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

const leafElementsCount: number = 1000;

@Component({
  selector: 'demo-select-example-15',
  templateUrl: './example-15.component.html',
  styleUrls: ['./example-15.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample15Component {
  public readonly control: FormControl = new FormControl([]);

  public readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly treeDataOrigin: FlatTreeItem[] = [
    new FlatTreeItem(true, 'Wolves', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🐺 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Cars', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🚗 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Burgers', 0, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `🍔 ${index + 1}`, 1, null, null, true)),
    new FlatTreeItem(true, 'Faces', 0, null, null, false),
    new FlatTreeItem(true, 'Happy', 1, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `😀 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(true, 'Sad', 1, null, null, false),
    ...new Array(leafElementsCount)
      .fill(null)
      .map((_: null, index: number) => new FlatTreeItem(false, `😥 ${index + 1}`, 2, null, null, true)),
    new FlatTreeItem(false, '🐵', 1, null, null, true),
    new FlatTreeItem(false, '🙊', 1, null, null, true),
    new FlatTreeItem(false, '🙉', 1, null, null, true),
    new FlatTreeItem(false, '🙈', 1, null, null, true),
  ].map((item: FlatTreeItem) => ({ ...item, id: getUuid() }));

  public toggleLoader(): void {
    this.isLoading$.pipe(take(1)).subscribe((isLoading: boolean) => {
      this.isLoading$.next(!isLoading);
    });
  }
}

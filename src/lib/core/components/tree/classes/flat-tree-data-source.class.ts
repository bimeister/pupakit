import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';
import { FlatTreeItem } from './flat-tree-item.class';

export class FlatTreeDataSource extends DataSource<FlatTreeItem> {
  private readonly activeRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);

  constructor(
    private readonly sortedData$: Observable<FlatTreeItem[]>,
    private readonly treeControl: FlatTreeControl<FlatTreeItem>
  ) {
    super();
  }

  public connect(_collectionViewer: CollectionViewer): Observable<FlatTreeItem[]> {
    return this.sortedData$.pipe(
      map((source: FlatTreeItem[]) => {
        const expandedItemsIds: string[] = this.treeControl.expansionModel.selected.map(
          (item: FlatTreeItem) => item.id
        );
        return FlatTreeDataSource.filterCollapsedNodes(source, expandedItemsIds);
      }),
      withLatestFrom(this.activeRange$),
      map(([visibleSourceSection, range]: [FlatTreeItem[], ListRange]) =>
        isNullOrUndefined(range) ? visibleSourceSection : visibleSourceSection.slice(range.start, range.end)
      )
    );
  }
  public disconnect(_collectionViewer: CollectionViewer): void {
    return;
  }

  public setRange(range: ListRange): void {
    this.activeRange$.next(range);
  }

  private static filterCollapsedNodes(source: FlatTreeItem[], expandedItemsIds: string[]): FlatTreeItem[] {
    if (!Array.isArray(source) || Object.is(source.length, 0)) {
      return [];
    }
    if (Object.is(source.length, 1)) {
      return source;
    }

    const sourceSections: FlatTreeItem[][] = FlatTreeDataSource.splitSourceByLeaves(source);
    const noEmbeddedArrays: boolean = !sourceSections.some((section: FlatTreeItem[]) => Array.isArray(section));
    if (noEmbeddedArrays) {
      return source;
    }

    const notCollapsedSections: FlatTreeItem[][] = sourceSections
      .map((section: FlatTreeItem[]) => {
        const sectionIsEmpty: boolean = Object.is(section.length, 0);
        if (sectionIsEmpty) {
          return [];
        }

        const sectionContainsOnlyOneElement: boolean = Object.is(section.length, 1);
        if (sectionContainsOnlyOneElement) {
          return section;
        }

        const sectionHasNoExpandableItems: boolean = !section.some((item: FlatTreeItem) => item.isExpandable);
        if (sectionHasNoExpandableItems) {
          return section;
        }

        return FlatTreeDataSource.removeInvisibleSectionPart(section, expandedItemsIds);
      })
      .filter((section: FlatTreeItem[]) => Array.isArray(section));

    return notCollapsedSections.flat();
  }

  private static splitSourceByLeaves(source: FlatTreeItem[]): FlatTreeItem[][] {
    if (!Array.isArray(source) || Object.is(source.length, 0)) {
      return [];
    }
    if (Object.is(source.length, 1)) {
      return [source];
    }

    const leafStartIndexes: Set<number> = new Set<number>();
    source.forEach((item: FlatTreeItem, index: number, array: FlatTreeItem[]) => {
      const isFirstItem: boolean = Object.is(index, 0);
      if (isFirstItem) {
        leafStartIndexes.add(index);
        return;
      }

      const previousItem: FlatTreeItem = array[index - 1];
      const isAnotherLeaf: boolean = Object.is(item.level, previousItem.level);
      if (isAnotherLeaf) {
        leafStartIndexes.add(index);
        return;
      }
    });
    const result: FlatTreeItem[][] = Array.from(leafStartIndexes.values())
      .map((leaveStartIndex: number, index: number, array: number[]) => {
        const leaveEndIndex: number = array[index + 1];
        return [leaveStartIndex, leaveEndIndex];
      })
      .map(([leaveStartIndex, leaveEndIndex]: [number, number]) => source.slice(leaveStartIndex, leaveEndIndex));

    return result;
  }

  private static removeInvisibleSectionPart(section: FlatTreeItem[], expandedItemsIds: string[]): FlatTreeItem[] {
    const sectionIsEmpty: boolean = Object.is(section.length, 0);
    if (sectionIsEmpty) {
      return [];
    }

    const sectionContainsOnlyOneElement: boolean = Object.is(section.length, 1);
    if (sectionContainsOnlyOneElement) {
      return section;
    }

    const indexOfCollapsedElement: number = section.findIndex(
      (item: FlatTreeItem) => !item.isExpandable || (item.isExpandable && !expandedItemsIds.includes(item.id))
    );

    const collapsedElementIsNotFound: boolean = Object.is(indexOfCollapsedElement, -1);
    if (collapsedElementIsNotFound) {
      return section;
    }

    const collapsedElementIsLastInSection: boolean = Object.is(indexOfCollapsedElement, section.length - 1);
    if (collapsedElementIsLastInSection) {
      return section;
    }

    return section.slice(0, indexOfCollapsedElement + 1);
  }
}

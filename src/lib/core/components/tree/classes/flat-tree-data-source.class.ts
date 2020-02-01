import { DataSource, ListRange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { isNullOrUndefined } from './../../../../helpers/is-null-or-undefined.helper';
import { FlatTreeItem } from './flat-tree-item.class';

export class FlatTreeDataSource extends DataSource<FlatTreeItem> {
  private readonly activeRange$: BehaviorSubject<ListRange> = new BehaviorSubject<ListRange>(null);
  private readonly disconnect$: Subject<void> = new Subject<void>();

  constructor(
    private readonly sortedData$: Observable<FlatTreeItem[]>,
    private readonly expandedItemsIds$: Observable<string[]>,
    private readonly treeControl: FlatTreeControl<FlatTreeItem>
  ) {
    super();
    this.expandedItemsIds$
      .pipe(
        map((expandedItemsIds: string[]) =>
          this.treeControl.expansionModel.selected.filter(
            (treeItem: FlatTreeItem) => !expandedItemsIds.includes(treeItem.id)
          )
        ),
        takeUntil(this.disconnect$)
      )
      .subscribe((itemsToCollapse: FlatTreeItem[]) =>
        itemsToCollapse.forEach((item: FlatTreeItem) => treeControl.collapseDescendants(item))
      );
  }

  public connect(): Observable<FlatTreeItem[]> {
    return combineLatest([this.sortedData$, this.expandedItemsIds$]).pipe(
      map(([source, expandedItemsIds]: [FlatTreeItem[], string[]]) => {
        const visibleTreeItems: FlatTreeItem[] = source
          .map((item: FlatTreeItem, index: number, itemsSource: FlatTreeItem[]) => {
            const isFirstItem: boolean = Object.is(index, 0);
            if (isFirstItem) {
              // tslint:disable-next-line: no-console
              console.log('isFirstItem', item);
              return item;
            }

            const currentItemIsUndefined: boolean = isNullOrUndefined(item);
            if (currentItemIsUndefined) {
              // tslint:disable-next-line: no-console
              console.log('currentItemIsUndefined', item);
              return null;
            }

            const currentItemIsRoot: boolean = Object.is(item.level, 0);
            if (currentItemIsRoot) {
              // tslint:disable-next-line: no-console
              console.log('currentItemIsRoot', item);
              return item;
            }

            const previousItem: FlatTreeItem = itemsSource[index - 1];
            const previousItemIsNotDefined: boolean = isNullOrUndefined(previousItem);
            if (previousItemIsNotDefined) {
              // tslint:disable-next-line: no-console
              console.log('previousItemIsNotDefined', item, previousItem);
              return null;
            }

            const previousItemIsSibling: boolean = Object.is(previousItem.level, item.level);
            if (previousItemIsSibling) {
              // tslint:disable-next-line: no-console
              console.log('previousItemIsSibling', item, previousItem);
              return item;
            }

            const previousItemIsParent: boolean = Object.is(previousItem.level + 1, item.level);
            const parentIsExpanded: boolean = previousItem.isExpandable && expandedItemsIds.includes(previousItem.id);
            if (previousItemIsParent && parentIsExpanded) {
              // tslint:disable-next-line: no-console
              console.log('previousItemIsParent && parentIsExpanded', item, previousItem);
              return item;
            }
            // tslint:disable-next-line: no-console
            console.log('other', item, previousItem);
            return null;
          })
          .filter((item: FlatTreeItem) => !isNullOrUndefined(item));

        return visibleTreeItems;
        // tslint:disable-next-line: no-console
        console.log('source', source);
        return FlatTreeDataSource.filterCollapsedNodes(source, expandedItemsIds);
      }),
      withLatestFrom(this.activeRange$),
      map(([visibleSourceSection, range]: [FlatTreeItem[], ListRange]) =>
        isNullOrUndefined(range) ? visibleSourceSection : visibleSourceSection.slice(range.start, range.end)
      ),
      // tslint:disable-next-line: no-console
      tap(data => console.log('result', data))
    );
  }
  public disconnect(): void {
    this.disconnect$.next();
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
    // tslint:disable-next-line: no-console
    console.log('sourceLeaves', sourceSections);
    const noEmbeddedArrays: boolean = !sourceSections.some((section: FlatTreeItem[]) => Array.isArray(section));
    if (noEmbeddedArrays) {
      return source;
    }

    return this.getSectionsWithoutInvisibleItems(sourceSections, expandedItemsIds).flat();
  }

  private static getSectionsWithoutInvisibleItems(
    sections: FlatTreeItem[][],
    expandedItemsIds: string[]
  ): FlatTreeItem[][] {
    if (!Array.isArray(sections) || Object.is(sections.length, 0)) {
      return [];
    }

    return sections
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

    return section;
    // // tslint:disable-next-line: no-console
    // console.log('section before cleanup', section);
    // return section.slice(0, indexOfCollapsedElement + 1);
  }
}

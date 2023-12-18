import { ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { PagedVirtualScrollArguments } from '@bimeister/pupakit.common';
import {
  TableColumnDefinition,
  TableColumnPin,
  TableColumnSorting,
  TableController,
  TableEvents,
  TableFeatureEvents,
  TablePagedDataProducer,
  TableSortingFeature,
  TableTreeDefinition,
  TableTreeFeature,
} from '@bimeister/pupakit.table';
import { getUuid, sortByProperty } from '@bimeister/utilities';
import { Observable, Subscription, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

interface SomeData {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  age: number;
  expandable?: boolean;
  expanded?: boolean;
  parentId?: string | null;
  level?: number;
  childrenNumber: number;
}

function createFlatTree(itemsNumber: number, maxLevel: number = 3, maxChildren: number = 3): SomeData[] {
  const flatTree: SomeData[] = [];
  for (let index: number = 0; flatTree.length < itemsNumber; index++) {
    const treeBranchItems: SomeData[] = Array.from(
      generateFlatTreeBranch(0, null, maxLevel, maxChildren, index, index)
    );
    treeBranchItems.length = Math.min(treeBranchItems.length, itemsNumber - flatTree.length);
    flatTree.push(...treeBranchItems);
  }
  return flatTree;
}

function createFlatTreeNode(
  parentId: string,
  branch: number,
  level: number,
  sequence: number,
  childrenNumber: number
): SomeData {
  return {
    id: getUuid(),
    firstName: `Azamat ${branch} - ${level} - ${sequence}`,
    lastName: `Aitaliev ${branch} - ${level} - ${sequence}`,
    city: 'Moscow',
    age: parseInt(`${branch}${level}${sequence}`, 10),
    expandable: childrenNumber > 0,
    expanded: false,
    parentId,
    level,
    childrenNumber,
  };
}

function* generateFlatTreeBranch(
  level: number,
  parentId: string,
  maxLevel: number,
  maxChildren: number,
  branch: number,
  sequence: number
): Generator<SomeData> {
  const childNodesNumber: number = Math.max(0, Math.floor(Math.random() * (maxChildren + 1)));
  const node: SomeData = createFlatTreeNode(parentId, branch, level, sequence, childNodesNumber);
  yield node;

  for (let counter: number = 0; counter < childNodesNumber; counter++) {
    yield* generateFlatTreeBranch(level + 1, node.id, maxLevel, maxChildren, branch, counter);
  }
}

const DATA: SomeData[] = createFlatTree(50, 15, 1);

const tableTreeDefinition: TableTreeDefinition = {
  modelIdKey: 'id',
  modelExpandableKey: 'expandable',
  modelExpandedKey: 'expanded',
  modelParentIdKey: 'parentId',
  modelLevelKey: 'level',
  modelNestedRowNumberKey: 'childrenNumber',
  treeNodeMarker: 'app-dot-single',
};

const COLUMNS: TableColumnDefinition[] = [
  {
    id: 'first-name',
    modelKey: 'firstName',
    title: 'First Name',
    pin: TableColumnPin.Left,
    defaultSizes: { widthPx: 200 },
    featureOptions: {
      ...tableTreeDefinition,
    },
  },
  {
    id: 'last-name',
    modelKey: 'lastName',
    title: 'Last Name',
    pin: TableColumnPin.None,
    defaultSizes: {
      widthPx: 200,
      minWidthPx: 70,
      maxWidthPx: 300,
    },
  },
  {
    id: 'city',
    modelKey: 'city',
    title: 'City',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 200 },
  },
  {
    id: 'age',
    modelKey: 'age',
    title: 'Age',
    pin: TableColumnPin.None,
    defaultSizes: { widthPx: 100 },
  },
];

const COLUMNS_MAP: Map<string, TableColumnDefinition> = new Map<string, TableColumnDefinition>(
  COLUMNS.map((column: TableColumnDefinition) => [column.id, column])
);

@Component({
  selector: 'demo-table-example-11',
  templateUrl: './example-11.component.html',
  styleUrls: ['./example-11.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExample11Component implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  public readonly controller: TableController<SomeData> = new TableController<SomeData>({
    // Add predefinded sorting feature. Also you may write your own features
    features: [TableSortingFeature, TableTreeFeature],
  });

  private columnDefinitions: TableColumnDefinition[] = COLUMNS;

  private readonly pagedDataProducer: TablePagedDataProducer<SomeData> = new TablePagedDataProducer(this.controller, {
    rowsBufferSize: 5,
    bodyInitialCountOfSkeletonRows: 5,
  });
  private readonly pagedArguments$: Observable<PagedVirtualScrollArguments> = this.pagedDataProducer.arguments$;
  private readonly loadingRowIds: Set<string> = new Set();
  private static readonly data: SomeData[] = DATA.filter((item: SomeData) => item.level === 0);

  constructor() {
    this.controller.setColumnDefinitions(COLUMNS);
    // this.controller.setData(DATA);

    this.subscription.add(this.processSortingChanges());
    this.subscription.add(this.processDndEnd());
    this.subscription.add(this.processExpandChanges());
    this.subscription.add(this.processRangeDataChanges());

    this.subscription.add(this.pagedArguments$.subscribe(console.warn));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processExpandChanges(): Subscription {
    return this.controller
      .getEvents(TableFeatureEvents.ExpandRowChanged)
      .subscribe(({ expandRowInfo: { expanded, rowDataId, rowId } }: TableFeatureEvents.ExpandRowChanged) => {
        const rowDataIndex: number = TableExample11Component.data.findIndex((item: SomeData) => item.id === rowDataId);
        const row: SomeData = TableExample11Component.data[rowDataIndex];

        row.expanded = expanded;

        if (Boolean(expanded)) {
          this.loadingRowIds.add(rowId);
          this.controller.setLoading(...this.loadingRowIds);
          let sliceStart: number;
          let sliceEnd: number;
          for (let index: number = 0; index < DATA.length; index++) {
            const item: SomeData = DATA[index];
            if (item.id === rowDataId) {
              sliceStart = index + 1;
              continue;
            }
            if (sliceStart !== undefined && (item.parentId === row.parentId || item.level < row.level)) {
              sliceEnd = index;
              break;
            }
          }
          const slice: SomeData[] = DATA.slice(sliceStart, sliceEnd ?? DATA.length);
          setTimeout(() => {
            this.loadingRowIds.delete(rowId);
            this.controller.setLoading(...this.loadingRowIds);
            TableExample11Component.data.splice(rowDataIndex + 1, 0, ...slice);
            this.controller.setData(TableExample11Component.data);
          }, 3000);
        } else {
          const sliceStart: number = rowDataIndex + 1;
          let sliceEnd: number;
          for (let index: number = sliceStart; index < TableExample11Component.data.length; index++) {
            const item: SomeData = TableExample11Component.data[index];
            if (item.parentId === row.parentId || item.level < row.level) {
              sliceEnd = index;
              break;
            }
          }
          TableExample11Component.data.splice(sliceStart, (sliceEnd ?? DATA.length) - sliceStart);
          this.controller.setData(TableExample11Component.data);
        }
      });
  }

  private processSortingChanges(): Subscription {
    return this.controller
      .getEvents(TableFeatureEvents.ColumnSortingChanged)
      .subscribe(({ tableSort }: TableFeatureEvents.ColumnSortingChanged) => {
        if (tableSort.sort === TableColumnSorting.Asc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(tableSort.columnId);
          this.controller.setData(sortByProperty(DATA, column.modelKey, 'ascending'));
          return;
        }

        if (tableSort.sort === TableColumnSorting.Desc) {
          const column: TableColumnDefinition = COLUMNS_MAP.get(tableSort.columnId);
          this.controller.setData(sortByProperty(DATA, column.modelKey, 'descending'));
          return;
        }

        this.controller.setData(DATA);
      });
  }

  private processDndEnd(): Subscription {
    return this.controller.getEvents(TableEvents.ColumnDragEnd).subscribe((event: TableEvents.ColumnDragEnd) => {
      const columnDefinitions: TableColumnDefinition[] = [...this.columnDefinitions];

      columnDefinitions.splice(event.oldIndex, 1);
      columnDefinitions.splice(event.newIndex, 0, this.columnDefinitions[event.oldIndex]);

      this.controller.setColumnDefinitions(columnDefinitions);
      this.columnDefinitions = columnDefinitions;
    });
  }

  private processRangeDataChanges(): Subscription {
    return this.pagedArguments$
      .pipe(
        switchMap((pagedArguments: PagedVirtualScrollArguments) => {
          const skip: number = pagedArguments.currentFrom;
          const take: number = pagedArguments.currentTo - pagedArguments.currentFrom;

          return TableExample11Component.getData(skip, take).pipe(
            map(({ total, list }: { total: number; list: SomeData[] }) => {
              const data: SomeData[] = Array.from({ length: total });
              data.splice(skip, take, ...list);

              return data;
            })
          );
        })
      )
      .subscribe((data: SomeData[]) => this.controller.setData(data));
  }

  private static getData(skip: number, take: number): Observable<{ total: number; list: SomeData[] }> {
    const dataSlice: SomeData[] = TableExample11Component.data.slice(skip, skip + take);
    return of({ total: TableExample11Component.data.length, list: dataSlice }).pipe(delay(800));
  }
}

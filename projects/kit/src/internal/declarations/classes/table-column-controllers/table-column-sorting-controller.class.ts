import { isNil } from '@bimeister/utilities';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { TableColumnSorting } from '../../enums/table-column-sorting.enum';
import { TableColumnDefinition } from '../../interfaces/table-column-definition.interface';

export class TableColumnSortingController {
  private readonly definition$: ReplaySubject<TableColumnDefinition> = new ReplaySubject<TableColumnDefinition>(1);
  private readonly sortingState$: ReplaySubject<TableColumnSorting> = new ReplaySubject<TableColumnSorting>(1);
  public readonly sorting$: Observable<TableColumnSorting> = this.sortingState$.pipe(distinctUntilChanged());

  constructor() {
    this.setInitialSortingState();
  }

  public setDefinition(definition: TableColumnDefinition): void {
    this.definition$.next(definition);
  }

  public toggleSorting(isNoneAvailable: boolean = true): void {
    if (!isNoneAvailable) {
      this.sorting$.pipe(take(1)).subscribe((sorting: TableColumnSorting) => {
        switch (sorting) {
          case TableColumnSorting.Asc:
            this.setSorting(TableColumnSorting.Desc);
            return;
          case TableColumnSorting.Desc:
            this.setSorting(TableColumnSorting.Asc);
            return;
          default:
            return;
        }
      });
      return;
    }

    const sortings: TableColumnSorting[] = Object.values(TableColumnSorting);
    this.sorting$.pipe(take(1)).subscribe((sorting: TableColumnSorting) => {
      const currentIndex: number = sortings.indexOf(sorting);
      let newIndex: number = currentIndex + 1;
      if (newIndex === sortings.length) {
        newIndex = 0;
      }
      this.setSorting(sortings[newIndex]);
    });
  }

  public setSorting(sorting: TableColumnSorting): void {
    this.sortingState$.next(sorting);
  }

  private setInitialSortingState(): void {
    this.definition$.pipe(take(1)).subscribe((definition: TableColumnDefinition) => {
      this.sortingState$.next(
        !isNil(definition.isSortingNoneAvailable) && !definition.isSortingNoneAvailable
          ? TableColumnSorting.Asc
          : TableColumnSorting.None
      );
    });
  }
}

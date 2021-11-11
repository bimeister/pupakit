import { filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { asapScheduler, BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, pluck, subscribeOn, switchMap, take } from 'rxjs/operators';
import { TableColumnSorting } from '../enums/table-column-sorting.enum';
import { TableAdaptiveColumnSizes } from '../interfaces/table-adaptive-column-sizes.interface';
import { TableColumnDefinition } from '../interfaces/table-column-definition.interface';
import { TableColumnRef } from '../interfaces/table-column-ref.interface';
import { TableColumnSizes } from '../interfaces/table-column-sizes.interface';

const BREAKPOINTS: string[] = ['xxl', 'xl', 'xlg', 'lg', 'md', 'sm', 'xs'];

const UNDEFINED_SIZES: TableColumnSizes = {
  widthPx: 100,
  minWidthPx: -Infinity,
  maxWidthPx: Infinity
};

export class TableColumn implements TableColumnRef {
  private definitionSetterState: Nullable<TableColumnDefinition> = null;
  public set definition(value: TableColumnDefinition) {
    this.definitionSetterState = value;

    this.defaultSizes$.next(value.defaultSizes);
    this.adaptiveSizes$.next(value.adaptiveSizes);
  }

  public get definition(): Nullable<TableColumnDefinition> {
    return this.definitionSetterState;
  }

  private readonly sortingState$: BehaviorSubject<TableColumnSorting> = new BehaviorSubject<TableColumnSorting>(
    TableColumnSorting.None
  );
  public readonly sorting$: Observable<TableColumnSorting> = this.sortingState$.pipe(distinctUntilChanged());

  private readonly defaultSizes$: BehaviorSubject<Nullable<TableColumnSizes>> = new BehaviorSubject<
    Nullable<TableColumnSizes>
  >(null);
  private readonly adaptiveSizes$: BehaviorSubject<Nullable<TableAdaptiveColumnSizes>> = new BehaviorSubject<
    Nullable<TableAdaptiveColumnSizes>
  >(null);

  private readonly breakpointToSizesMap$: Observable<Map<string, TableColumnSizes>> = combineLatest([
    this.defaultSizes$,
    this.adaptiveSizes$
  ]).pipe(
    map(([defaultSizes, adaptiveSizes]: [Nullable<TableColumnSizes>, Nullable<TableAdaptiveColumnSizes>]) => {
      const sanitizedSizes: TableColumnSizes = isNil(defaultSizes)
        ? UNDEFINED_SIZES
        : { ...UNDEFINED_SIZES, ...defaultSizes };
      const breakpointToSizesMap: Map<string, TableColumnSizes> = new Map<string, TableColumnSizes>();

      BREAKPOINTS.forEach((breakpoint: string, index: number) => {
        const largerBreakpointSizes: TableColumnSizes =
          index === 0 ? sanitizedSizes : breakpointToSizesMap.get(BREAKPOINTS[index - 1]);
        breakpointToSizesMap.set(
          breakpoint,
          isNil(adaptiveSizes?.[breakpoint])
            ? largerBreakpointSizes
            : { ...UNDEFINED_SIZES, ...adaptiveSizes[breakpoint] }
        );
      });
      return breakpointToSizesMap;
    }),
    shareReplayWithRefCount()
  );

  public readonly breakpoint$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  public readonly currentBreakpointSizes$: Observable<TableColumnSizes> = combineLatest([
    this.breakpoint$.pipe(filterNotNil()),
    this.breakpointToSizesMap$
  ]).pipe(
    map(([currentBreakpoint, breakpointToSizesMap]: [string, Map<string, TableColumnSizes>]) =>
      breakpointToSizesMap.get(currentBreakpoint)
    ),
    shareReplayWithRefCount()
  );

  private readonly minWidthPx$: Observable<number> = this.currentBreakpointSizes$.pipe(pluck('minWidthPx'));
  private readonly maxWidthPx$: Observable<number> = this.currentBreakpointSizes$.pipe(pluck('maxWidthPx'));
  private readonly definitionWidthPxState$: Observable<number> = this.currentBreakpointSizes$.pipe(pluck('widthPx'));

  private readonly userWidthPxState$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  public readonly widthPx$: Observable<number> = combineLatest([
    this.definitionWidthPxState$,
    this.minWidthPx$,
    this.maxWidthPx$,
    this.userWidthPxState$
  ]).pipe(
    map(([widthPxState, minWidthPx, maxWidthPx, userPxState]: [number, number, number, Nullable<number>]) => {
      const widthPx: number = isNil(userPxState) ? widthPxState : userPxState;
      if (!isNil(minWidthPx) && widthPx < minWidthPx) {
        return minWidthPx;
      }

      if (!isNil(maxWidthPx) && widthPx > maxWidthPx) {
        return maxWidthPx;
      }

      return widthPx;
    }),
    distinctUntilChanged()
  );

  public readonly isHovered$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  public updateWidthByDeltaPx(deltaPx: number): Observable<boolean> {
    const result$: Subject<boolean> = new Subject<boolean>();

    this.widthPx$
      .pipe(
        take(1),
        switchMap((widthPx: number) => {
          const newWidth: number = widthPx + deltaPx;
          return this.setWidth(newWidth);
        })
      )
      .subscribe((result: boolean) => {
        result$.next(result);
        result$.complete();
      });

    return result$;
  }

  public setWidth(widthPx: number): Observable<boolean> {
    const result$: Subject<boolean> = new Subject<boolean>();

    combineLatest([this.minWidthPx$, this.maxWidthPx$])
      .pipe(take(1), subscribeOn(asapScheduler))
      .subscribe(([minWidthPx, maxWidthPx]: [number, number]) => {
        if (!isNil(minWidthPx) && widthPx < minWidthPx) {
          this.userWidthPxState$.next(minWidthPx);
          result$.next(false);
          result$.complete();
          return;
        }

        if (!isNil(maxWidthPx) && widthPx > maxWidthPx) {
          this.userWidthPxState$.next(maxWidthPx);
          result$.next(false);
          result$.complete();
          return;
        }

        this.userWidthPxState$.next(widthPx);
        result$.next(true);
        result$.complete();
      });

    return result$;
  }
}

import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';
import { filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { asapScheduler, BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, subscribeOn, switchMap, take, tap } from 'rxjs/operators';
import { TableAdaptiveColumnSizes } from '../interfaces/table-adaptive-column-sizes.interface';
import { TableColumnSizes } from '../interfaces/table-column-sizes.interface';

const BREAKPOINTS: string[] = ['xxl', 'xl', 'xlg', 'lg', 'md', 'sm', 'xs'];

const MIN_POSSIBLE_COLUMN_WIDTH_PX: number = 34;

const UNDEFINED_SIZES: TableColumnSizes = {
  widthPx: 100,
  minWidthPx: MIN_POSSIBLE_COLUMN_WIDTH_PX,
  maxWidthPx: Infinity,
};

export class TableColumnSizeState {
  private readonly defaultSizes$: BehaviorSubject<Nullable<TableColumnSizes>> = new BehaviorSubject<
    Nullable<TableColumnSizes>
  >(null);
  private readonly adaptiveSizes$: BehaviorSubject<Nullable<TableAdaptiveColumnSizes>> = new BehaviorSubject<
    Nullable<TableAdaptiveColumnSizes>
  >(null);

  private readonly breakpointToSizesMap$: Observable<Map<string, TableColumnSizes>> = combineLatest([
    this.defaultSizes$,
    this.adaptiveSizes$,
  ]).pipe(
    map(([defaultSizes, adaptiveSizes]: [Nullable<TableColumnSizes>, Nullable<TableAdaptiveColumnSizes>]) => {
      const breakpointToSizesMap: Map<string, TableColumnSizes> = new Map<string, TableColumnSizes>();

      BREAKPOINTS.forEach((breakpoint: string, index: number) => {
        const largerBreakpointSizes: TableColumnSizes =
          index === 0 ? defaultSizes : breakpointToSizesMap.get(BREAKPOINTS[index - 1]);
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

  public readonly breakpoint$: Observable<Nullable<string>> = this.clientUiStateHandlerService.breakpoint$;

  public readonly currentBreakpointSizes$: Observable<TableColumnSizes> = combineLatest([
    this.breakpoint$.pipe(filterNotNil()),
    this.breakpointToSizesMap$,
  ]).pipe(
    tap(() => this.fitWidthPxState$.next(null)),
    map(([currentBreakpoint, breakpointToSizesMap]: [string, Map<string, TableColumnSizes>]) =>
      breakpointToSizesMap.get(currentBreakpoint)
    ),
    shareReplayWithRefCount()
  );

  private readonly minWidthPx$: Observable<number> = this.currentBreakpointSizes$.pipe(
    map((sizes: TableColumnSizes) => sizes.minWidthPx)
  );
  private readonly maxWidthPx$: Observable<number> = this.currentBreakpointSizes$.pipe(
    map((sizes: TableColumnSizes) => sizes.maxWidthPx)
  );
  private readonly definitionWidthPxState$: Observable<number> = this.currentBreakpointSizes$.pipe(
    map((sizes: TableColumnSizes) => sizes.widthPx)
  );

  private readonly userWidthPxState$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);
  private readonly fitWidthPxState$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  public readonly widthPx$: Observable<number> = combineLatest([
    this.definitionWidthPxState$,
    this.minWidthPx$,
    this.maxWidthPx$,
    this.userWidthPxState$,
    this.fitWidthPxState$,
  ]).pipe(
    map(
      ([widthPxState, minWidthPx, maxWidthPx, userPxState, fitWidthPxState]: [
        number,
        number,
        number,
        Nullable<number>,
        Nullable<number>
      ]) => {
        if (!isNil(fitWidthPxState)) {
          return fitWidthPxState;
        }

        const widthPx: number = userPxState ?? widthPxState;
        if (!isNil(minWidthPx) && widthPx < minWidthPx) {
          return minWidthPx;
        }

        if (!isNil(maxWidthPx) && widthPx > maxWidthPx) {
          return maxWidthPx;
        }
        return widthPx;
      }
    ),
    distinctUntilChanged()
  );

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}

  public setDefinitionSizes(defaultSizes?: TableColumnSizes, adaptiveSizes?: TableAdaptiveColumnSizes): void {
    this.defaultSizes$.next(this.sanitizeDefaultColumnSizes(defaultSizes));
    this.adaptiveSizes$.next(adaptiveSizes);
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
    this.fitWidthPxState$.next(null);

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

  public setFitWidth(widthPx: number): void {
    this.userWidthPxState$.next(null);
    this.fitWidthPxState$.next(widthPx);
  }

  private sanitizeDefaultColumnSizes(defaultSizes?: TableColumnSizes): TableColumnSizes {
    if (isNil(defaultSizes)) {
      return UNDEFINED_SIZES;
    }

    return {
      ...UNDEFINED_SIZES,
      ...defaultSizes,
      minWidthPx:
        defaultSizes.minWidthPx >= MIN_POSSIBLE_COLUMN_WIDTH_PX
          ? defaultSizes.minWidthPx
          : MIN_POSSIBLE_COLUMN_WIDTH_PX,
    };
  }
}

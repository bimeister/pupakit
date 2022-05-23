import { filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { ClientUiStateHandlerService } from '../../shared/services/client-ui-state-handler.service';
import { asapScheduler, BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, subscribeOn, switchMap, take } from 'rxjs/operators';
import { TableAdaptiveColumnSizes } from '../interfaces/table-adaptive-column-sizes.interface';
import { TableColumnSizes } from '../interfaces/table-column-sizes.interface';

const BREAKPOINTS: string[] = ['xxl', 'xl', 'xlg', 'lg', 'md', 'sm', 'xs'];

const UNDEFINED_SIZES: TableColumnSizes = {
  widthPx: 100,
  minWidthPx: -Infinity,
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

  public readonly breakpoint$: Observable<Nullable<string>> = this.clientUiStateHandlerService.breakpoint$;

  public readonly currentBreakpointSizes$: Observable<TableColumnSizes> = combineLatest([
    this.breakpoint$.pipe(filterNotNil()),
    this.breakpointToSizesMap$,
  ]).pipe(
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

  public readonly widthPx$: Observable<number> = combineLatest([
    this.definitionWidthPxState$,
    this.minWidthPx$,
    this.maxWidthPx$,
    this.userWidthPxState$,
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

  constructor(private readonly clientUiStateHandlerService: ClientUiStateHandlerService) {}

  public setDefinitionSizes(defaultSizes?: TableColumnSizes, adaptiveSizes?: TableAdaptiveColumnSizes): void {
    this.defaultSizes$.next(defaultSizes);
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

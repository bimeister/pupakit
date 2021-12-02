import { distinctUntilSerializedChanged, isEqual, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ScrollBarSizes } from '../interfaces/scroll-bar-sizes.interface';

export class Scrollbar {
  private lastSizes: Nullable<ScrollBarSizes> = null;

  private readonly sizePx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private readonly contentSizePx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private readonly contentScrollSizePx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly contentScrollOffsetPx$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public readonly thumbSizePx$: Observable<number> = combineLatest([
    this.contentSizePx$,
    this.sizePx$,
    this.contentScrollSizePx$,
  ]).pipe(
    distinctUntilSerializedChanged(),
    map(([contentSizePx, sizePx, contentScrollSizePx]: [number, number, number]) => {
      const realThumbSizePx: number = (contentSizePx * sizePx) / contentScrollSizePx;
      return realThumbSizePx < Scrollbar.maxSizePx ? Scrollbar.maxSizePx : realThumbSizePx;
    }),
    shareReplayWithRefCount()
  );

  public readonly thumbOffsetPx$: Observable<number> = combineLatest([
    this.contentScrollOffsetPx$,
    this.contentScrollSizePx$,
    this.contentSizePx$,
    this.sizePx$,
    this.thumbSizePx$,
  ]).pipe(
    distinctUntilSerializedChanged(),
    map(
      ([contentScrollOffsetPx, contentScrollSizePx, contentSizePx, sizePx, thumbSizePx]: [
        number,
        number,
        number,
        number,
        number
      ]) => {
        const maxContentScrollOffsetPx: number = contentScrollSizePx - contentSizePx;
        const contentScrollOffsetPercentage: number = (contentScrollOffsetPx / maxContentScrollOffsetPx) * 100;

        const thumbMaxOffsetPx: number = sizePx - thumbSizePx;
        return (contentScrollOffsetPercentage / 100) * thumbMaxOffsetPx;
      }
    ),
    shareReplayWithRefCount()
  );

  private static readonly maxSizePx: number = 32;

  public setSizes(sizes: ScrollBarSizes): void {
    if (isEqual(this.lastSizes, sizes)) {
      return;
    }
    this.lastSizes = sizes;
    this.sizePx$.next(sizes.scrollbarSizePx);
    this.contentSizePx$.next(sizes.contentSizePx);
    this.contentScrollSizePx$.next(sizes.contentScrollSizePx);
  }

  public setContentScrollOffset(contentScrollOffsetPx: number): void {
    this.contentScrollOffsetPx$.next(contentScrollOffsetPx);
  }

  public getContentScrollOffsetByScrollbarThumbDeltaOffset(deltaPx: number): Observable<number> {
    return combineLatest([this.sizePx$, this.thumbSizePx$, this.contentScrollSizePx$, this.contentSizePx$]).pipe(
      take(1),
      map(([sizePx, thumbSizePx, contentScrollSizePx, contentSizePx]: [number, number, number, number]) => {
        const thumbMaxOffsetPx: number = sizePx - thumbSizePx;
        const deltaPercentage: number = (deltaPx / thumbMaxOffsetPx) * 100;
        const maxContentScrollOffsetPx: number = contentScrollSizePx - contentSizePx;
        return (deltaPercentage / 100) * maxContentScrollOffsetPx;
      })
    );
  }
}

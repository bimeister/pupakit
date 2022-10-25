import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { isTableCellHtmlElement } from '../declarations/type-guards/is-table-cell-html-element.type-guard';

@Injectable()
export class TableColumnsIntersectionService implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  private readonly columnIdToIntersectionEntryMap$: BehaviorSubject<Map<string, IntersectionObserverEntry>> =
    new BehaviorSubject<Map<string, IntersectionObserverEntry>>(new Map<string, IntersectionObserverEntry>());

  private readonly hiddenColumnsCount$: Observable<[string[], string[]]> = this.columnIdToIntersectionEntryMap$.pipe(
    map((columnIdToIntersectionEntryMap: Map<string, IntersectionObserverEntry>) => {
      const leftCountIds: string[] = [];
      const rightCountIds: string[] = [];

      for (const [columnId, entry] of columnIdToIntersectionEntryMap.entries()) {
        if (isNil(entry)) {
          continue;
        }

        if (entry.isIntersecting) {
          continue;
        }

        if (isNil(entry.rootBounds) || isNil(entry.boundingClientRect.x)) {
          continue;
        }

        if (entry.rootBounds.x > entry.boundingClientRect.x) {
          leftCountIds.push(columnId);
          continue;
        }

        if (entry.rootBounds.x < entry.boundingClientRect.x) {
          rightCountIds.push(columnId);
        }
      }

      return [leftCountIds, rightCountIds];
    }),
    shareReplayWithRefCount<[string[], string[]]>()
  );

  public readonly leftHiddenColumnIds$: Observable<string[]> = this.hiddenColumnsCount$.pipe(
    map((data: [string[], string[]]) => data[0])
  );
  public readonly rightHiddenColumnIds$: Observable<string[]> = this.hiddenColumnsCount$.pipe(
    map((data: [string[], string[]]) => data[1])
  );

  private readonly intersectionObserver$: BehaviorSubject<Nullable<IntersectionObserver>> = new BehaviorSubject<
    Nullable<IntersectionObserver>
  >(null);
  public readonly entries$: Subject<IntersectionObserverEntry[]> = new Subject<IntersectionObserverEntry[]>();

  constructor() {
    this.subscription.add(this.processEntriesChanges());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public registerScrollArea(element: HTMLElement): void {
    this.intersectionObserver$.pipe(take(1)).subscribe((intersectionObserver: Nullable<IntersectionObserver>) => {
      if (!isNil(intersectionObserver)) {
        intersectionObserver.disconnect();
      }

      const newIntersectionObserver: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          this.entries$.next(entries);
        },
        {
          root: element,
          threshold: 0,
        }
      );

      this.intersectionObserver$.next(newIntersectionObserver);
    });
  }

  public observe(element: HTMLElement): void {
    if (!isTableCellHtmlElement(element)) {
      return;
    }
    this.intersectionObserver$.pipe(filterNotNil(), take(1)).subscribe((intersectionObserver: IntersectionObserver) => {
      intersectionObserver.observe(element);
    });
  }

  public unobserve(element: HTMLElement): void {
    if (!isTableCellHtmlElement(element)) {
      return;
    }
    this.intersectionObserver$
      .pipe(filterNotNil(), take(1), withLatestFrom(this.columnIdToIntersectionEntryMap$))
      .subscribe(
        ([intersectionObserver, columnIdToIntersectionEntryMap]: [
          IntersectionObserver,
          Map<string, IntersectionObserverEntry>
        ]) => {
          const mapCopy: Map<string, IntersectionObserverEntry> = new Map<string, IntersectionObserverEntry>(
            columnIdToIntersectionEntryMap
          );
          mapCopy.delete(element.dataset.columnId);
          intersectionObserver.unobserve(element);
          this.columnIdToIntersectionEntryMap$.next(mapCopy);
        }
      );
  }

  private processEntriesChanges(): Subscription {
    return this.entries$
      .pipe(withLatestFrom(this.columnIdToIntersectionEntryMap$))
      .subscribe(
        ([entries, columnIdToIntersectionEntryMap]: [
          IntersectionObserverEntry[],
          Map<string, IntersectionObserverEntry>
        ]) => {
          const mapCopy: Map<string, IntersectionObserverEntry> = new Map<string, IntersectionObserverEntry>(
            columnIdToIntersectionEntryMap
          );
          for (const entry of entries) {
            if (!(entry.target instanceof HTMLElement)) {
              continue;
            }
            const columnId: string = entry.target.dataset.columnId;
            mapCopy.set(columnId, entry);
          }
          this.columnIdToIntersectionEntryMap$.next(mapCopy);
        }
      );
  }
}

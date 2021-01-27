import {
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  NgIterable,
  OnChanges,
  OnDestroy,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef
} from '@angular/core';
import { filterNotNil, filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { switchMap, take, withLatestFrom } from 'rxjs/operators';
import { ComponentChange } from '../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../internal/declarations/interfaces/component-changes.interface';
import { PagedVirtualScrollStateService } from '../services/paged-virtual-scroll-state.service';

type PupaVirtualForType<U, T> = Nullable<U & NgIterable<T>>;

class PupaVirtualForOfContext<T, U extends NgIterable<T> = NgIterable<T>> {
  constructor(public $implicit: T, public pupaVirtualForOf: U, public index: number, public count: number) {}
}

class RecordViewTuple<T, U extends NgIterable<T>> {
  constructor(public record: any, public view: EmbeddedViewRef<PupaVirtualForOfContext<T, U>>) {}
}

@Directive({ selector: '[pupaVirtualFor][pupaVirtualForOf]' })
export class PagedVirtualScrollForDirective<T, U extends NgIterable<T> = NgIterable<T>>
  implements OnChanges, DoCheck, OnDestroy {
  private readonly pupaVirtualForOfDirty$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly differ$: BehaviorSubject<IterableDiffer<T> | null> = new BehaviorSubject<IterableDiffer<T> | null>(
    null
  );

  @Input() public pupaVirtualForOf: PupaVirtualForType<U, T>;
  private readonly pupaVirtualForOf$: BehaviorSubject<PupaVirtualForType<U, T>> = new BehaviorSubject<
    PupaVirtualForType<U, T>
  >(null);

  @Input() public trackByFunction: TrackByFunction<T>;
  private readonly trackByFunction$: BehaviorSubject<TrackByFunction<T>> = new BehaviorSubject<TrackByFunction<T>>(
    null
  );

  @Input() public template: TemplateRef<PupaVirtualForOfContext<T, U>> = this.hostTemplate;
  private readonly template$: BehaviorSubject<TemplateRef<PupaVirtualForOfContext<T, U>>> = new BehaviorSubject<
    TemplateRef<PupaVirtualForOfContext<T, U>>
  >(this.hostTemplate);

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly differs: IterableDiffers,
    private readonly hostTemplate: TemplateRef<PupaVirtualForOfContext<T, U>>,
    private readonly pagedVirtualScrollStateService: PagedVirtualScrollStateService
  ) {
    this.subscription.add(this.processDifferChanges());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processPupaVirtualForOfChange(changes?.pupaVirtualForOf);
    this.processTrackByFunctionChange(changes?.trackByFunction);
    this.processTemplateChange(changes?.template);
  }

  public ngDoCheck(): void {
    this.checkDiffersChanges();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private applyChanges(changes: IterableChanges<T>): void {
    combineLatest([this.pupaVirtualForOf$, this.template$])
      .pipe(take(1))
      .subscribe(
        ([pupaVirtualForOf, template]: [PupaVirtualForType<U, T>, TemplateRef<PupaVirtualForOfContext<T, U>>]) => {
          const insertTuples: RecordViewTuple<T, U>[] = this.applyInsertedTuples({
            changes,
            template,
            pupaVirtualForOf
          });
          this.applyPerViewChanges(insertTuples);

          this.updateItemViews(pupaVirtualForOf);

          this.applyItemsIdentityChanges(changes);
        }
      );
  }

  private applyInsertedTuples({
    changes,
    template,
    pupaVirtualForOf
  }: {
    changes: IterableChanges<T>;
    pupaVirtualForOf: PupaVirtualForType<U, T>;
    template: TemplateRef<PupaVirtualForOfContext<T, U>>;
  }): RecordViewTuple<T, U>[] {
    const insertTuples: RecordViewTuple<T, U>[] = [];

    changes.forEachOperation(
      (item: IterableChangeRecord<any>, adjustedPreviousIndex: number | null, currentIndex: number | null) => {
        if (isNil(item.previousIndex)) {
          const createdIndex: Nullable<number> = currentIndex ?? undefined;
          const viewRef: EmbeddedViewRef<PupaVirtualForOfContext<T, U>> = this.viewContainer.createEmbeddedView(
            template,
            new PupaVirtualForOfContext<T, U>(null, pupaVirtualForOf, -1, -1),
            createdIndex
          );

          const tuple: RecordViewTuple<T, U> = new RecordViewTuple<T, U>(item, viewRef);
          insertTuples.push(tuple);

          return;
        }

        if (isNil(currentIndex)) {
          const removedIndex: Nullable<number> = adjustedPreviousIndex ?? undefined;
          this.viewContainer.remove(removedIndex);
          return;
        }

        if (!isNil(adjustedPreviousIndex)) {
          const viewRef: EmbeddedViewRef<
            PupaVirtualForOfContext<T, U>
          > = this.getViewFromViewContainerAsEmbeddedViewRef(adjustedPreviousIndex);

          this.viewContainer.move(viewRef, currentIndex);
          const tuple: RecordViewTuple<T, U> = new RecordViewTuple(item, viewRef);
          insertTuples.push(tuple);
        }
      }
    );

    return insertTuples;
  }

  private applyPerViewChanges(insertTuples: RecordViewTuple<T, U>[]): void {
    insertTuples.forEach(({ view, record }: RecordViewTuple<T, U>) => (view.context.$implicit = record.item));
  }

  private updateItemViews(pupaVirtualForOf: PupaVirtualForType<U, T>): void {
    const countOfAttachedViewsOnContainer: number = this.viewContainer.length;
    Array(countOfAttachedViewsOnContainer)
      .fill(null)
      .map((_item: null, attachedItemIndex: number) => {
        const viewRef: EmbeddedViewRef<PupaVirtualForOfContext<T, U>> = this.getViewFromViewContainerAsEmbeddedViewRef(
          attachedItemIndex
        );
        viewRef.context.index = attachedItemIndex;
        viewRef.context.count = countOfAttachedViewsOnContainer;
        viewRef.context.pupaVirtualForOf = pupaVirtualForOf;
      });
  }

  private applyItemsIdentityChanges(changes: IterableChanges<T>): void {
    changes.forEachIdentityChange((record: IterableChangeRecord<T>) => {
      const viewRef: EmbeddedViewRef<PupaVirtualForOfContext<T, U>> = this.getViewFromViewContainerAsEmbeddedViewRef(
        record.currentIndex
      );
      viewRef.context.$implicit = record.item;
    });
  }

  private checkDiffersChanges(): void {
    this.pupaVirtualForOfDirty$
      .pipe(
        take(1),
        filterTruthy(),
        switchMap(() => combineLatest([this.pupaVirtualForOf$, this.trackByFunction$, this.differ$]))
      )
      .subscribe(
        ([pupaVirtualForOf, trackByFunction, differ]: [
          PupaVirtualForType<U, T>,
          TrackByFunction<T>,
          IterableDiffer<T>
        ]) => {
          this.pupaVirtualForOfDirty$.next(false);
          differ;

          const value: NgIterable<T> = pupaVirtualForOf;
          if (isNil(differ) && value) {
            try {
              const upcomingDiffer: IterableDiffer<T> = this.differs.find(value).create(trackByFunction);
              this.differ$.next(upcomingDiffer);
            } catch {
              throw new Error(
                `[PagedVirtualScrollForDirective]: [checkDiffersChanges] Cannot find a differ supporting object '${value}' of type '${
                  value['name'] || typeof value
                }'. PupaVirtualFor only supports binding to Iterables such as Arrays.`
              );
            }
          }
        }
      );
  }

  private processDifferChanges(): Subscription {
    return this.differ$
      .pipe(filterNotNil(), withLatestFrom(this.pupaVirtualForOf$))
      .subscribe(([differ, pupaVirtualForOf]: [IterableDiffer<T>, PupaVirtualForType<U, T>]) => {
        const changes: IterableChanges<T> = differ.diff(pupaVirtualForOf);
        if (isNil(changes)) {
          return;
        }
        this.applyChanges(changes);
      });
  }

  private processPupaVirtualForOfChange(change: ComponentChange<this, PupaVirtualForType<U, T>>): void {
    const updatedValue: PupaVirtualForType<U, T> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    if (Array.isArray(updatedValue)) {
      this.pagedVirtualScrollStateService.itemsTotalCount$.next(updatedValue.length);
    }

    this.pupaVirtualForOf$.next(updatedValue);
    this.pupaVirtualForOfDirty$.next(true);
  }

  private processTrackByFunctionChange(change: ComponentChange<this, TrackByFunction<T>>): void {
    const updatedTrackByFunction: TrackByFunction<T> | undefined = change?.currentValue;

    if (!isNil(updatedTrackByFunction) && typeof updatedTrackByFunction !== 'function') {
      throw new Error(`[PagedVirtualScrollForDirective] trackBy must be a function.`);
    }
    this.trackByFunction$.next(updatedTrackByFunction);
  }

  private processTemplateChange(change: ComponentChange<this, TemplateRef<PupaVirtualForOfContext<T, U>>>): void {
    const updatedValue: TemplateRef<PupaVirtualForOfContext<T, U>> | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.template$.next(this.template);
  }

  /** @deprecated Angular type shit 🤡  */
  private getViewFromViewContainerAsEmbeddedViewRef(index: number): EmbeddedViewRef<PupaVirtualForOfContext<T, U>> {
    return this.viewContainer.get(index) as EmbeddedViewRef<PupaVirtualForOfContext<T, U>>;
  }

  /**
   * @deprecated Angular render shit 🤡
   * Asserts the correct type of the context for the template that `NgForOf` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgForOf` structural directive renders its template with a specific context type.
   */
  public static ngTemplateContextGuard<T, U extends NgIterable<T>>(
    _dir: PagedVirtualScrollForDirective<T, U>,
    _ctx: any
  ): _ctx is PupaVirtualForOfContext<T, U> {
    return true;
  }
}

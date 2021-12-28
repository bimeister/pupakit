import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filterNotNil, isNil, Nullable, resizeObservable } from '@bimeister/utilities';
import { animationFrameScheduler, BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, observeOn, switchMap, withLatestFrom } from 'rxjs/operators';
import { SelectTriggerBase } from '../../../../../internal/declarations/classes/abstract/select-trigger-base.abstract';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { SelectTriggerTagContext } from '../../../../../internal/declarations/interfaces/select-trigger-tag-context.interface';
import { PupaSelectTriggerTagTemplateDirective } from '../../directives/select-trigger-tag-template.directive';
import { SelectStateService } from '../../services/select-state.service';

const MAX_TAGS_RENDER_COUNT: number = 20;
const RESIZE_DEBOUNCE_TIME_MS: number = 200;

@Component({
  selector: 'pupa-select-trigger-tags',
  templateUrl: './select-trigger-tags.component.html',
  styleUrls: ['./select-trigger-tags.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTriggerTagsComponent<T> extends SelectTriggerBase<T> implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('overlayOrigin', { static: true }) protected readonly overlayOrigin: CdkOverlayOrigin;
  @ViewChild('button', { static: true }) protected readonly button: ElementRef<HTMLButtonElement>;

  @Input() public tags: T[] = [];
  public readonly renderTags$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private readonly tagsTotalCount$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  @ContentChild(PupaSelectTriggerTagTemplateDirective)
  public readonly selectTriggerTagTemplate: PupaSelectTriggerTagTemplateDirective<T>;

  @ViewChild('defaultTemplate') private readonly defaultTemplateRef: TemplateRef<SelectTriggerTagContext<T>>;

  @ViewChild('tagsContainer') private readonly tagsContainerRef: ElementRef<HTMLElement>;
  private readonly tagsContainer$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<Nullable<HTMLElement>>(
    null
  );

  private readonly tagsContainerWidthPx$: Observable<number> = this.tagsContainer$.pipe(
    observeOn(animationFrameScheduler),
    filterNotNil(),
    distinctUntilChanged(),
    switchMap((element: Nullable<HTMLDivElement>) => resizeObservable(element)),
    map(([entry]: ResizeObserverEntry[]) => (!isNil(entry) ? entry.contentRect.width : 0))
  );

  public readonly tagsOverflowCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly subscription: Subscription = new Subscription();

  constructor(selectStateService: SelectStateService<T>, private readonly changeDetectorRef: ChangeDetectorRef) {
    super(selectStateService);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processTagsChanges(changes?.tags);
  }

  public ngAfterViewInit(): void {
    this.setTagsContainer();

    this.subscription.add(this.calculateOverflowItemsCount());
    this.subscription.add(this.setTagsContainerRefOnFilled());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getSelectTriggerTagTemplateRef(): TemplateRef<SelectTriggerTagContext<T>> {
    return this.selectTriggerTagTemplate?.templateRef ?? this.defaultTemplateRef;
  }

  private processTagsChanges(change: ComponentChange<this, T[]>): void {
    const updatedValue: T[] | undefined = change?.currentValue;

    if (!Array.isArray(updatedValue)) {
      return;
    }

    const serializedTags: T[] = updatedValue.slice(0, MAX_TAGS_RENDER_COUNT);
    this.renderTags$.next(serializedTags);

    this.tagsTotalCount$.next(updatedValue.length);
  }

  private setTagsContainer(): void {
    if (isNil(this.tagsContainerRef)) {
      return;
    }

    this.tagsContainer$.next(this.tagsContainerRef.nativeElement);
  }

  private getCurrentTagsOverflowCount(tagsContainerWidthPx: number): number {
    const tags: Element[] = Array.from(this.tagsContainerRef?.nativeElement?.children ?? []);

    const tagsWidthPxList: number[] = tags.map(({ clientWidth }: Element) => clientWidth);

    const totalWidthPxByTagPositionList: number[] = tagsWidthPxList.reduce(
      (tagsWidthPxAccumulator: number[], tagWidthPx: number) => {
        const previousTotalWidthPx: number = tagsWidthPxAccumulator[tagsWidthPxAccumulator.length - 1] ?? 0;
        return [...tagsWidthPxAccumulator, previousTotalWidthPx + tagWidthPx];
      },
      []
    );

    const indexOfTagOnBoundContainer: number = totalWidthPxByTagPositionList.findIndex(
      (width: number) => width > tagsContainerWidthPx
    );

    if (indexOfTagOnBoundContainer < 0) {
      return 0;
    }

    return tags.length - indexOfTagOnBoundContainer;
  }

  private calculateOverflowItemsCount(): Subscription {
    return combineLatest([this.tagsContainerWidthPx$, this.renderTags$])
      .pipe(
        map(([tagsContainerWidthPx, _renderTags]: [number, T[]]) => tagsContainerWidthPx),
        debounceTime(RESIZE_DEBOUNCE_TIME_MS),
        observeOn(animationFrameScheduler),
        map((tagsContainerWidthPx: number) => this.getCurrentTagsOverflowCount(tagsContainerWidthPx)),
        withLatestFrom(this.tagsTotalCount$),
        map(
          ([currentSliceOverflowCount, tagsTotalCount]: [number, number]) =>
            Math.max(0, tagsTotalCount - MAX_TAGS_RENDER_COUNT) + currentSliceOverflowCount
        ),
        distinctUntilChanged()
      )
      .subscribe((overflowCount: number) => {
        this.tagsOverflowCount$.next(overflowCount);
        this.detectChanges();
      });
  }

  private setTagsContainerRefOnFilled(): Subscription {
    return this.triggerValueIsVisible$
      .pipe(observeOn(animationFrameScheduler))
      .subscribe(() => this.setTagsContainer());
  }

  private detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }
}

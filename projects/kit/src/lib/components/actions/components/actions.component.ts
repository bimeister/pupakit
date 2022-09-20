import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { filterNotNil, isNil, Nullable, resizeObservable } from '@bimeister/utilities';

import { animationFrameScheduler, BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, observeOn, switchMap, withLatestFrom } from 'rxjs/operators';

import { PupaActionDropdownTemplateDirective } from '../directives/action-dropdown-template.directive';
import { PupaActionMoreTriggerTemplateDirective } from '../directives/action-more-trigger-template.directive';
import { PupaActionTemplateDirective } from '../directives/action-template.directive';
import { ComponentChanges } from '../../../../internal/declarations/interfaces/component-changes.interface';
import { ComponentChange } from '../../../../internal/declarations/interfaces/component-change.interface';
import { ActionContext } from '../../../../internal/declarations/interfaces/action-context.interface';
import { ACTIONS_DEFAULT_MORE_BUTTON_TRIGGER_TEXT_TOKEN } from '../../../../internal/constants/tokens/actions-default-more-button-trigger-text.token';
import { DropdownMenuContextService } from '../../dropdown-menu/services/dropdown-menu-context.service';

const MAX_ACTIONS_RENDER_COUNT: number = 20;
const RESIZE_DEBOUNCE_TIME_MS: number = 200;

@Component({
  selector: 'pupa-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DropdownMenuContextService],
})
export class ActionsComponent<T> implements OnChanges, AfterViewInit, AfterContentInit, OnDestroy {
  @Input()
  public actions: T[] = [];

  @ViewChild('defaultTemplate', { static: true })
  private readonly defaultTemplateRef: TemplateRef<ActionContext<T>>;

  @ViewChild('dropdownContainer')
  public readonly dropdownContainerRef: ElementRef<HTMLElement>;

  @ViewChild('actionsContainer')
  public readonly actionsContainerRef: ElementRef<HTMLElement>;
  public readonly actionsContainer$: BehaviorSubject<Nullable<HTMLElement>> = new BehaviorSubject<
    Nullable<HTMLElement>
  >(null);

  @ContentChild(PupaActionTemplateDirective)
  public readonly actionTemplate: PupaActionTemplateDirective<T>;

  @ContentChild(PupaActionDropdownTemplateDirective)
  public readonly actionDropdownTemplate: PupaActionDropdownTemplateDirective<T>;

  @ContentChild(PupaActionMoreTriggerTemplateDirective)
  private readonly actionMoreTriggerTemplate: PupaActionMoreTriggerTemplateDirective<T>;

  public readonly defaultMoreButtonText: string = this.actionsDefaultMoreButtonText;

  public readonly renderActions$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public readonly actionsTotalCount$: BehaviorSubject<Nullable<number>> = new BehaviorSubject<Nullable<number>>(null);

  public readonly actionsOverflowCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private readonly actions$: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public readonly renderDropdownActions$: Observable<T[]> = this.actionsOverflowCount$.pipe(
    withLatestFrom(this.actions$),
    map(([count, actions]: [number, T[]]) => {
      const lastVisibleAction: number = actions.length - count;
      return actions.slice(lastVisibleAction);
    })
  );

  public readonly actionsContainerWidthPx$: Observable<number> = this.actionsContainer$.pipe(
    observeOn(animationFrameScheduler),
    filterNotNil(),
    distinctUntilChanged(),
    switchMap((element: Nullable<HTMLDivElement>) => resizeObservable(element)),
    map(([entry]: ResizeObserverEntry[]) => (!isNil(entry) ? entry.contentRect.width : 0))
  );

  public readonly actionsContainerMaxHeight$: Observable<number> = this.actionsContainer$.pipe(
    observeOn(animationFrameScheduler),
    filterNotNil(),
    distinctUntilChanged(),
    map((container: HTMLElement) => container.firstElementChild?.clientHeight)
  );

  private readonly subscription: Subscription = new Subscription();

  constructor(
    @Optional()
    @Inject(ACTIONS_DEFAULT_MORE_BUTTON_TRIGGER_TEXT_TOKEN)
    private readonly actionsDefaultMoreButtonText: string,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processActionsChanges(changes?.actions);
  }

  public ngAfterContentInit(): void {
    this.checkActionDropdownTemplate();
  }

  public ngAfterViewInit(): void {
    this.setActionsContainer();

    this.subscription.add(this.calculateOverflowItemsCount());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getActionMoreTriggerTemplateRef(): TemplateRef<ActionContext<T>> {
    return this.actionMoreTriggerTemplate?.templateRef ?? this.defaultTemplateRef;
  }

  private checkActionDropdownTemplate(): void {
    if (isNil(this.actionDropdownTemplate?.templateRef)) {
      throw Error('Using the pupaActionDropdownTemplate directive is a required for the component to work!');
    }
  }

  private processActionsChanges(change: ComponentChange<this, T[]>): void {
    const updatedValue: T[] | undefined = change?.currentValue;

    if (!Array.isArray(updatedValue)) {
      return;
    }

    const serializedActions: T[] = updatedValue.slice(0, MAX_ACTIONS_RENDER_COUNT);

    this.actions$.next(updatedValue);
    this.renderActions$.next(serializedActions);
    this.actionsTotalCount$.next(updatedValue.length);
  }

  private setActionsContainer(): void {
    if (isNil(this.actionsContainerRef)) {
      return;
    }

    this.actionsContainer$.next(this.actionsContainerRef.nativeElement);
  }

  private getCurrentActionsOverflowCount(actionsContainerWidthPx: number): number {
    const actions: Element[] = Array.from(this.actionsContainerRef?.nativeElement?.children ?? []);
    const dropdownWidth: number = this.dropdownContainerRef?.nativeElement.clientWidth ?? 0;

    if (actions.length === 1) {
      return 0;
    }

    const actionsWidthPxList: number[] = actions.map(({ clientWidth }: Element) => clientWidth);

    const totalWidthPxByActionsPositionList: number[] = actionsWidthPxList.reduce(
      (actionsWidthPxAccumulator: number[], actionWidthPx: number) => {
        const previousTotalWidthPx: number = actionsWidthPxAccumulator[actionsWidthPxAccumulator.length - 1] ?? 0;
        return [...actionsWidthPxAccumulator, previousTotalWidthPx + actionWidthPx];
      },
      []
    );

    const indexOfActionOnBoundContainer: number = totalWidthPxByActionsPositionList.findIndex(
      (width: number, index: number) =>
        width >
        (index === totalWidthPxByActionsPositionList.length - 1
          ? actionsContainerWidthPx + dropdownWidth
          : actionsContainerWidthPx)
    );

    if (indexOfActionOnBoundContainer < 0) {
      return 0;
    }

    return actions.length - indexOfActionOnBoundContainer;
  }

  private calculateOverflowItemsCount(): Subscription {
    return combineLatest([this.actionsContainerWidthPx$, this.renderActions$])
      .pipe(
        map(([actionsContainerWidthPx, _renderActions]: [number, T[]]) => actionsContainerWidthPx),
        debounceTime(RESIZE_DEBOUNCE_TIME_MS),
        observeOn(animationFrameScheduler),
        map((actionsContainerWidthPx: number) => this.getCurrentActionsOverflowCount(actionsContainerWidthPx)),
        withLatestFrom(this.actionsTotalCount$),
        map(
          ([currentSliceOverflowCount, actionsTotalCount]: [number, number]) =>
            Math.max(0, actionsTotalCount - MAX_ACTIONS_RENDER_COUNT) + currentSliceOverflowCount
        ),
        distinctUntilChanged()
      )
      .subscribe((overflowCount: number) => {
        this.actionsOverflowCount$.next(overflowCount);
        this.detectChanges();
      });
  }

  private detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }
}

import { AfterViewChecked, ChangeDetectorRef, Directive, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { filterNotNil, isNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { TabsServiceBase } from './tabs-service-base.abstract';

@Directive()
export abstract class TabsBase<T, S extends TabsServiceBase<T>> implements AfterViewChecked, OnDestroy {
  protected readonly subscription: Subscription = new Subscription();

  public abstract readonly activeTabNameChange: EventEmitter<T>;

  protected readonly stateService: S = !isNil(this.containerService) ? this.containerService : this.tabsService;
  private readonly activeTabName$: Observable<Nullable<T>> = this.stateService.activeTabName$;
  public readonly railHighlighterOffsetLeftTransform$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public readonly railHighlighterWidthPx$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public readonly isLeftGradient$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isRightGradient$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly isHorizontalScrollExist$: Observable<boolean> = combineLatest([
    this.isLeftGradient$,
    this.isRightGradient$,
  ]).pipe(
    map(([isLeftGradient, isRightGradient]: [boolean, boolean]) => isLeftGradient || isRightGradient),
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  public readonly isContentDragging$: Observable<boolean> = this.tabsService.isContentDragging$;

  constructor(
    private readonly tabsService: S,
    protected readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    private readonly containerService?: S
  ) {
    this.subscription.add(this.processActiveTabNameChanges());
    this.subscription.add(this.processRailHighlighterOffsetLeftTransform());
    this.subscription.add(this.processRailHighlighterWidthPx());
  }

  protected detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  public ngAfterViewChecked(): void {
    this.stateService.setInitialTab();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public handleContentDragStart(): void {
    this.tabsService.setContentDraggingStateState(true);
    this.detectChanges();
  }

  public handleContentDragEnd(): void {
    this.tabsService.setContentDraggingStateState(false);
    this.detectChanges();
  }

  public setLeftGradient(isLeftGradient: boolean): void {
    this.isLeftGradient$.next(isLeftGradient);
    this.detectChanges();
  }

  public setRightGradient(isRightGradient: boolean): void {
    this.isRightGradient$.next(isRightGradient);
    this.detectChanges();
  }

  private processActiveTabNameChanges(): Subscription {
    return this.activeTabName$.pipe(filterNotNil()).subscribe((activeTabName: T) => {
      this.activeTabNameChange.emit(activeTabName);
    });
  }

  private processRailHighlighterOffsetLeftTransform(): Subscription {
    return this.stateService.railHighlighterOffsetLeftPx$
      .pipe(map((railHighlighterOffsetLeftPx: number) => `translateX(${railHighlighterOffsetLeftPx}px)`))
      .subscribe((transformRailHighlighterOffsetLeftPx: string) => {
        this.ngZone.run(() => this.railHighlighterOffsetLeftTransform$.next(transformRailHighlighterOffsetLeftPx));
      });
  }

  private processRailHighlighterWidthPx(): Subscription {
    return this.stateService.railHighlighterWidthPx$.subscribe((processRailHighlighterWidthPx: number) => {
      this.ngZone.run(() => this.railHighlighterWidthPx$.next(processRailHighlighterWidthPx));
    });
  }
}

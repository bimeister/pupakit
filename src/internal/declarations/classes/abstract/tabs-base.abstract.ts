import { AfterViewChecked, Directive, EventEmitter, OnDestroy } from '@angular/core';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TabsServiceBase } from './tabs-service-base.abstract';

@Directive()
export abstract class TabsBase<T, S extends TabsServiceBase<T>> implements AfterViewChecked, OnDestroy {
  protected readonly subscription: Subscription = new Subscription();

  public abstract readonly activeTabNameChange: EventEmitter<T>;

  protected readonly stateService: S = !isNil(this.containerService) ? this.containerService : this.tabsService;
  private readonly activeTabName$: Observable<Nullable<T>> = this.stateService.activeTabName$;

  public readonly railHighlighterOffsetLeftTransform$: Observable<string> =
    this.stateService.railHighlighterOffsetLeftPx$.pipe(
      map((railHighlighterOffsetLeftPx: number) => `translateX(${railHighlighterOffsetLeftPx}px)`)
    );
  public readonly railHighlighterWidthPx$: Observable<number> = this.stateService.railHighlighterWidthPx$.pipe(
    delay(0)
  );

  constructor(private readonly tabsService: S, private readonly containerService?: S) {
    this.subscription.add(this.processActiveTabNameChanges());
  }

  public ngAfterViewChecked(): void {
    this.stateService.setInitialTab();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processActiveTabNameChanges(): Subscription {
    return this.activeTabName$.pipe(filterNotNil()).subscribe((activeTabName: T) => {
      this.activeTabNameChange.emit(activeTabName);
    });
  }
}

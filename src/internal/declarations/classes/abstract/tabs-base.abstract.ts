import { AfterViewChecked, Directive, EventEmitter, OnDestroy } from '@angular/core';
import { TabsServiceBase } from './tabs-service-base.abstract';
import { Observable, Subscription } from 'rxjs';
import { filterNotNil, isNil, Nullable } from '@bimeister/utilities';

@Directive()
export abstract class TabsBase<S extends TabsServiceBase> implements AfterViewChecked, OnDestroy {
  protected readonly subscription: Subscription = new Subscription();

  public abstract readonly activeTabNameChange: EventEmitter<string>;

  protected readonly stateService: S = !isNil(this.containerService) ? this.containerService : this.tabsService;
  private readonly activeTabName$: Observable<Nullable<string>> = this.stateService.activeTabName$;

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
    return this.activeTabName$.pipe(filterNotNil()).subscribe((activeTabName: string) => {
      this.activeTabNameChange.emit(activeTabName);
    });
  }
}

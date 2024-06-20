import { Directive, EventEmitter, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ComponentChanges } from '@bimeister/pupakit.common';
import { isNil, Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TabsServiceBase } from './tabs-service-base.abstract';

@Directive()
export abstract class TabsItemBase<T, S extends TabsServiceBase<T>> implements OnChanges, OnInit, OnDestroy {
  public abstract name: T;
  public abstract isActive: Nullable<boolean>;
  public abstract disabled: Nullable<boolean>;
  public abstract clickEvent: EventEmitter<VoidFunction>;

  protected readonly stateService: S = !isNil(this.containerService) ? this.containerService : this.tabsService;
  public readonly isActive$: Observable<boolean> = this.stateService.activeTabName$.pipe(
    map((activeTab: T | null) => activeTab === this.name)
  );

  public readonly isContentDragging$: Observable<boolean> = this.tabsService.isContentDragging$;

  constructor(private readonly tabsService: S, private readonly containerService?: S) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processInputIsActiveChanges(changes.isActive?.currentValue);
  }

  public ngOnInit(): void {
    this.stateService.registerTab(this.name);
  }

  public ngOnDestroy(): void {
    this.stateService.unregisterTab(this.name);
  }

  public setAsActive(): void {
    if (this.disabled) {
      return;
    }

    if (this.clickEvent.observers.length > 0) {
      this.clickEvent.emit(this.setActiveTab.bind(this));
      return;
    }

    this.setActiveTab();
  }

  private processInputIsActiveChanges(isActive: Nullable<boolean>): void {
    if (this.disabled || !isActive) {
      return;
    }
    queueMicrotask(() => this.setActiveTab());
  }

  private setActiveTab(): void {
    this.stateService.setActiveTab(this.name);
  }
}

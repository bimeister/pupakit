import { Directive, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { isNil, Nullable } from '@bimeister/utilities';
import { map } from 'rxjs/operators';
import { TabsServiceBase } from './tabs-service-base.abstract';

@Directive()
export abstract class TabsItemBase<S extends TabsServiceBase> implements OnChanges, OnInit {
  public abstract name: string;
  public abstract isActive: Nullable<boolean>;
  public abstract disabled: Nullable<boolean>;

  protected readonly stateService: S = !isNil(this.containerService) ? this.containerService : this.tabsService;
  public readonly isActive$: Observable<boolean> = this.stateService.activeTabName$.pipe(
    map((activeTab: string | null) => activeTab === this.name)
  );

  constructor(private readonly tabsService: S, private readonly containerService?: S) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processInputIsActiveChanges(changes.isActive?.currentValue);
  }

  public ngOnInit(): void {
    this.stateService.registerTab(this.name);
  }

  public setAsActive(): void {
    if (this.disabled || !isNil(this.isActive)) {
      return;
    }
    this.stateService.setActiveTab(this.name);
  }

  private processInputIsActiveChanges(isActive: Nullable<boolean>): void {
    if (this.disabled || !isActive) {
      return;
    }
    queueMicrotask(() => this.stateService.setActiveTab(this.name));
  }
}

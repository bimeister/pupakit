import { AfterViewInit, Directive, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { ComponentChange } from '../../interfaces/component-change.interface';
import { ComponentChanges } from '../../interfaces/component-changes.interface';
import { TabsStateProducerService } from './tabs-state-producer-service.abstract';

@Directive()
export abstract class TabsContainer implements OnChanges, AfterViewInit {
  @Input() public readonly isMultiSelectionEnabled: boolean = false;
  private readonly isMultiSelectionEnabled$: BehaviorSubject<boolean> = this.tabsStateService.isMultiSelectionEnabled$;

  @Output() public readonly selectedTabValues: EventEmitter<unknown[]> = this.tabsStateService.selectedTabValues;

  constructor(protected readonly tabsStateService: TabsStateProducerService) {}

  public ngAfterViewInit(): void {
    this.tabsStateService.setViewInit();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsMultiSelectionEnabledChanges(changes.isMultiSelectionEnabled);
  }

  private processIsMultiSelectionEnabledChanges(change: ComponentChange<this, boolean>): void {
    const updatedValue: boolean | undefined = change?.currentValue;

    if (isNil(updatedValue)) {
      return;
    }

    this.isMultiSelectionEnabled$.next(updatedValue);
  }
}

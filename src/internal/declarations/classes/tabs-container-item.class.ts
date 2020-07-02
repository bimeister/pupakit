import { HostListener, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';

import { isNullOrUndefined } from '../../helpers/is-null-or-undefined.helper';
import { ComponentChange } from '../interfaces/component-change.interface';
import { ComponentChanges } from '../interfaces/component-changes.interface';
import { TabsContainer } from './tabs-container.class';

export abstract class TabsContainerItem<T> implements OnChanges {
  @Input() public isVisible: boolean = true;
  @Input() public isActive: boolean = false;

  private readonly selectedTabs$: Observable<ThisType<T>[]> = this.tabsContainer.selectedTabs$;
  public readonly isSelected$: Observable<boolean> = this.selectedTabs$.pipe(
    map((tabs: ThisType<T>[]) => tabs.includes(this)),
    distinctUntilChanged()
  );

  constructor(protected readonly tabsContainer: TabsContainer<unknown>) {}

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsActiveValueChanges(changes?.isActive);
  }

  @HostListener('click')
  public processTabClick(): void {
    this.toggleSelection();
    this.tabsContainer.markTabAsClicked(this);
  }

  public deselect(): void {
    this.tabsContainer.deselectTab(this);
  }

  public select(): void {
    this.tabsContainer.selectTab(this);
  }

  public toggleSelection(): void {
    this.isSelected$.pipe(take(1)).subscribe((isSelected: boolean) => {
      isSelected ? this.deselect() : this.select();
    });
  }

  private processIsActiveValueChanges(change: ComponentChange<this, boolean>): void {
    const newState: boolean = change?.currentValue;
    if (isNullOrUndefined(newState)) {
      return;
    }

    newState ? this.select() : this.deselect();
  }
}

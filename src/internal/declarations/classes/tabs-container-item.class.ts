import { AfterViewInit, ChangeDetectorRef, HostListener, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 as guidGenerate } from 'uuid';

import { isNullOrUndefined } from '../../helpers/is-null-or-undefined.helper';
import { ComponentChange } from '../interfaces/component-change.interface';
import { ComponentChanges } from '../interfaces/component-changes.interface';
import { Uuid } from '../types/uuid.type';

export abstract class TabsContainerItem implements OnChanges, AfterViewInit {
  public readonly id: Uuid = guidGenerate();

  @Input() public isVisible: boolean = true;
  @Input() public isActive: boolean = false;

  public readonly onClick$: Subject<Uuid> = new Subject<Uuid>();
  public readonly onSelect$: Subject<Uuid> = new Subject<Uuid>();
  public readonly onDeselect$: Subject<Uuid> = new Subject<Uuid>();

  public isSelected: boolean = false;

  constructor(protected readonly changeDetectorRef: ChangeDetectorRef) {}

  @HostListener('click')
  public processTabClick(): void {
    this.toggleSelection();
    this.onClick$.next(this.id);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processIsActiveValueChanges(changes?.isActive);
  }

  public ngAfterViewInit(): void {
    this.updateSelectionState(this.isActive);
  }

  public deselect(): void {
    this.onDeselect$.next(this.id);
  }

  public select(): void {
    this.onSelect$.next(this.id);
  }

  public toggleSelection(): void {
    const newState: boolean = !this.isSelected;
    this.updateSelectionState(newState);
  }

  public triggerChangeDetector(): void {
    this.changeDetectorRef.detectChanges();
  }

  private processIsActiveValueChanges(change: ComponentChange<this, boolean>): void {
    const newState: boolean = change?.currentValue;
    if (isNullOrUndefined(newState)) {
      return;
    }

    this.updateSelectionState(newState);
  }

  private updateSelectionState(targetState: boolean): void {
    targetState ? this.select() : this.deselect();
    this.triggerChangeDetector();
  }
}

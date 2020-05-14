import { ChangeDetectorRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { Uuid } from '../types/uuid.type';

export abstract class TabsContainerItem implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();

  @Input() public isAutoSelectionDisabled: boolean = false;
  @Input() public isVisible: boolean = true;

  public readonly clicked$: Subject<this> = new Subject<this>();
  public readonly isSelected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly id: Uuid = uuid();

  constructor(protected readonly changeDetectorRef: ChangeDetectorRef) {}

  @HostListener('click')
  public processTabClick(): void {
    this.clicked$.next(this);
  }

  public ngOnInit(): void {
    this.subscription.add(this.triggerChangeDetectorOnSelection());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public deselect(): void {
    this.isSelected$.next(false);
  }

  public select(): void {
    this.isSelected$.next(true);
  }

  public toggleSelection(): void {
    this.isSelected$.pipe(take(1)).subscribe((isSelected: boolean) => {
      isSelected ? this.deselect() : this.select();
    });
  }

  private triggerChangeDetectorOnSelection(): Subscription {
    return this.isSelected$.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }
}

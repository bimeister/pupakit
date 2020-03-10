import { HostListener, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Uuid } from '../types/uuid.type';

export abstract class TabsContainerItem {
  @Input() public isAutoSelectionDisabled: boolean = false;

  public readonly clicked$: Subject<this> = new Subject<this>();
  public readonly isSelected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly id: Uuid = uuid();

  @HostListener('click')
  public processTabClick(): void {
    this.clicked$.next(this);
  }

  public deselect(): void {
    this.isSelected$.next(false);
  }

  public select(): void {
    this.isSelected$.next(true);
  }
}

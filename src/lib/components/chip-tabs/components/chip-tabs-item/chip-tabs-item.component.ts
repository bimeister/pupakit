import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Uuid } from '../../../../../internal/declarations/types/uuid.type';

@Component({
  selector: 'pupa-chip-tabs-item',
  templateUrl: './chip-tabs-item.component.html',
  styleUrls: ['./chip-tabs-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsItemComponent {
  @Input() public isAutoSelectionDisabled: boolean = false;

  public readonly clicked$: Subject<ChipTabsItemComponent> = new Subject<ChipTabsItemComponent>();
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

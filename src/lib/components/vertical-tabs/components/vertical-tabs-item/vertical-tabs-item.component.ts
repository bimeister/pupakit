import { ChangeDetectionStrategy, Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Uuid } from '../../../../../internal/declarations/types/uuid.type';

@Component({
  selector: 'pupa-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsItemComponent {
  @Input() public isAutoSelectionDisabled: boolean = false;

  public readonly clicked$: Subject<VerticalTabsItemComponent> = new Subject<VerticalTabsItemComponent>();
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

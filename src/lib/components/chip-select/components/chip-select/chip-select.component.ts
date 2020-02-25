import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { VOID } from '../../../../internal/constants/void.const';
import { ChipItem } from '../../../../internal/declarations/interfaces/chip-item.interface';
import { DroppableComponent } from '../../../droppable/components/droppable/droppable.component';

@Component({
  selector: 'pupa-chip-select',
  templateUrl: './chip-select.component.html',
  styleUrls: ['./chip-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipSelectComponent implements OnDestroy {
  @ViewChild(DroppableComponent, { static: true }) public droppable: DroppableComponent;

  @Input()
  public readonly: boolean = false;

  @Input()
  public selectOne: boolean = false;

  @Input()
  public set items(items: ChipItem[]) {
    this.items$.next(items);
  }

  public get items(): ChipItem[] {
    return this.items$.value;
  }

  public items$: BehaviorSubject<ChipItem[]> = new BehaviorSubject<ChipItem[]>([]);
  public selectItems$: BehaviorSubject<Set<ChipItem>> = new BehaviorSubject<Set<ChipItem>>(new Set());
  public positionChange$: Observable<void> = this.selectItems$.pipe(mapTo(VOID));

  @Input()
  public set selectItems(items: ChipItem[]) {
    if (!Array.isArray(items)) {
      return;
    }
    const selectItems: Set<ChipItem> = new Set<ChipItem>();
    const selectId: string[] = [];
    if (this.selectOne && items.length > 0) {
      items = [items[0]];
    }
    items.forEach(item => {
      selectId.push(item.key);
      selectItems.add(item);
    });
    this.notActiveKeys = selectId;
    this.selectItems$.next(selectItems);
  }

  public get selectItems(): ChipItem[] {
    return Array.from(this.selectItems$.value.values());
  }

  @Input()
  public maxWidth: number = 200;

  public notActiveKeys: string[] = [];

  private readonly _allItems: Set<ChipItem> = new Set<ChipItem>([]);

  @Output() public removedItem: EventEmitter<ChipItem> = new EventEmitter<ChipItem>(null);

  @Output() public addedItem: EventEmitter<ChipItem> = new EventEmitter<ChipItem>(null);

  private readonly subscription: Subscription = new Subscription();

  constructor() {
    this.subscription.add(
      this.items$.subscribe((items: ChipItem[]) => {
        this._allItems.clear();
        this.checkedAllItems(items);
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public removeItem(event: MouseEvent, item: ChipItem): void {
    event.stopPropagation();
    if (this.readonly) {
      return;
    }
    const selectItems: Set<ChipItem> = this.selectItems$.value;
    selectItems.delete(item);
    this.selectItems$.next(selectItems);
    this.removedItem.emit(item);
    this.notActiveKeys = this.notActiveKeys.filter(activeItem => activeItem !== item.key);
  }

  public clickDroppableItem(key: string): void {
    if (this.readonly) {
      return;
    }
    const item: ChipItem = Array.from(this._allItems).find(allItem => allItem.key === key);
    if (!item) {
      return;
    }
    if (this.selectOne) {
      this.selectItems = [item];
    } else {
      const selectItems: Set<ChipItem> = this.selectItems$.value;
      selectItems.add(item);
      this.selectItems$.next(selectItems);
    }
    this.addedItem.emit(item);
    this.notActiveKeys = [...this.notActiveKeys, key];
  }

  private checkedAllItems(items: ChipItem[]): void {
    if (!Array.isArray(items) || Object.is(items.length, 0)) {
      return;
    }
    items.forEach(item => {
      if (!Array.from(this._allItems.values()).some(allitem => allitem.key === item.key)) {
        this._allItems.add(item);
      }
      if (item.children && item.children.length > 0) {
        this.checkedAllItems(item.children);
      }
    });
  }
}

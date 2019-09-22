import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DroppableComponent } from '../droppable/droppable.component';
import { remSizePx } from './../../../constants/rem-size-px.const';

export interface ChipItem {
  key: string;
  value: string;
  icon: string;
  clickable?: boolean;
  children?: ChipItem[];
}

@Component({
  selector: 'pupa-chip-select',
  templateUrl: './chip-select.component.html',
  styleUrls: ['./chip-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('isHovered', [
      state(
        'true',
        style({
          width: `${remSizePx * 1}px`,
          opacity: '1'
        })
      ),
      state(
        'false',
        style({
          width: `0`,
          opacity: '0'
        })
      ),
      transition(`true => false`, animate('0.25s ease')),
      transition(`false => true`, animate('0.25s ease-in'))
    ])
  ]
})
export class ChipSelectComponent {
  public expandedButtonIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  @ViewChild(DroppableComponent, { static: true }) public droppable: DroppableComponent;

  @Input()
  public readonly: boolean = false;

  @Input()
  public selectOne: boolean = false;

  @Input()
  public set items(items: ChipItem[]) {
    this._items = [];
    this._allItems.clear();
    this.changeDetector.markForCheck();
    setTimeout(() => {
      this._items = items;
      this.checkedAllItems(this._items);
      this.changeDetector.markForCheck();
    }, 0);
  }

  public get items(): ChipItem[] {
    return this._items;
  }

  @Input()
  public set selectItems(items: ChipItem[]) {
    this._selectItems.clear();
    const selectId: string[] = [];
    if (this.selectOne && items.length > 0) {
      items = [items[0]];
    }
    items.forEach(item => {
      selectId.push(item.key);
      this._selectItems.add(item);
    });
    this.notActiveKeys = selectId;
  }

  public get selectItems(): ChipItem[] {
    return Array.from(this._selectItems.values());
  }

  @Input()
  public maxWidth: number = 200;

  public notActiveKeys: string[] = [];

  private _items: ChipItem[] = [];

  private readonly _selectItems: Set<ChipItem> = new Set<ChipItem>([]);

  private readonly _allItems: Set<ChipItem> = new Set<ChipItem>([]);

  @Output() public removedItem: EventEmitter<ChipItem> = new EventEmitter<ChipItem>(null);

  @Output() public addedItem: EventEmitter<ChipItem> = new EventEmitter<ChipItem>(null);

  constructor(protected readonly changeDetector: ChangeDetectorRef) {}

  public removeItem(event: MouseEvent, item: ChipItem): void {
    event.stopPropagation();
    if (this.readonly) {
      return;
    }
    this._selectItems.delete(item);
    this.removedItem.emit(item);
    this.notActiveKeys = this.notActiveKeys.filter(activeItem => activeItem !== item.key);
    this.changeDetector.markForCheck();
  }

  public get activeItems(): ChipItem[] {
    const keysCollection: Set<string> = new Set<string>(Array.from(this._selectItems).map(item => item.key));
    const result: ChipItem[] = this.items.filter(item => !keysCollection.has(item.key));
    if (result.length === 0) {
      this.droppable.open = false;
    }
    return result;
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
      this._selectItems.add(item);
    }
    this.addedItem.emit(item);
    this.notActiveKeys = [...this.notActiveKeys, key];
    this.changeDetector.markForCheck();
  }

  public buttonAnimationState(expandedButtonIndex: number, buttonIndex: number): string {
    return Object.is(expandedButtonIndex, buttonIndex) ? 'true' : 'false';
  }

  public updateExpandedButtonIndex(index: number): void {
    this.expandedButtonIndex$.next(index);
  }

  private checkedAllItems(items: ChipItem[]): void {
    items.forEach(item => {
      if (Array.from(this._allItems.values()).find(allitem => allitem.key === item.key) === undefined) {
        this._allItems.add(item);
      }
      if (item.children && item.children.length > 0) {
        this.checkedAllItems(item.children);
      }
    });
  }
}

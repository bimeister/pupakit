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
  constructor(protected readonly cDRef: ChangeDetectorRef) {}
  @ViewChild(DroppableComponent, { static: true }) public droppable: DroppableComponent;
  @Input()
  public set selectItems(items: ChipItem[]) {
    this._selectItems.clear();
    items.forEach(item => {
      this._selectItems.add(item);
    });
  }

  public get selectItems(): ChipItem[] {
    return Array.from(this._selectItems);
  }

  @Input() public items: ChipItem[] = [];

  @Output() public deleteItem: EventEmitter<ChipItem> = new EventEmitter<ChipItem>(null);

  @Output() public addItem: EventEmitter<ChipItem> = new EventEmitter<ChipItem>(null);

  @Output() public allItems: EventEmitter<ChipItem[]> = new EventEmitter<ChipItem[]>(null);

  private readonly _selectItems: Set<ChipItem> = new Set<ChipItem>([]);

  public removeItem(event: MouseEvent, item: ChipItem): void {
    event.stopPropagation();
    this._selectItems.delete(item);
    this.deleteItem.emit(item);
    this.allItems.emit(this.selectItems);
    this.cDRef.markForCheck();
    this.refreshDroppable();
  }

  public get visibleItems(): ChipItem[] {
    const keysCollection: Set<string> = new Set<string>(Array.from(this._selectItems).map(item => item.key));
    const result: ChipItem[] = this.items.filter(item => !keysCollection.has(item.key));
    if (result.length === 0) {
      this.droppable.open = false;
    }
    return result;
  }

  public clickDroppableItem(event: MouseEvent, item: ChipItem): void {
    event.stopPropagation();
    if (this.isObject(item.key)) {
      return;
    }
    this._selectItems.add(item);
    this.cDRef.markForCheck();
    this.addItem.emit(item);
    this.allItems.emit(this.selectItems);
    this.refreshDroppable();
  }

  public isObject(key: string): boolean {
    return Array.from(this._selectItems).find(item => item.key === key) !== undefined;
  }

  public buttonAnimationState(expandedButtonIndex: number, buttonIndex: number): string {
    return Object.is(expandedButtonIndex, buttonIndex) ? 'true' : 'false';
  }

  public updateExpandedButtonIndex(index: number): void {
    this.expandedButtonIndex$.next(index);
  }

  private refreshDroppable(): void {
    setTimeout(() => {
      this.droppable.checkPosition();
    }, 0);
  }
}

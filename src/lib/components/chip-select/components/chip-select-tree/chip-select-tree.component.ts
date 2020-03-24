import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { TreeItemNode } from '../../../../../internal/declarations/interfaces/tree-item-node.interface';

@Component({
  selector: 'pupa-chip-select-tree',
  templateUrl: './chip-select-tree.component.html',
  styleUrls: ['./chip-select-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipSelectTreeComponent implements OnDestroy {
  @Input()
  public set items(items: any[]) {
    this.items$.next(items);
  }

  public get items(): any[] {
    return this.items$.value;
  }

  @Input()
  public set notActiveKeys(keys: string[]) {
    this.notActiveKeys$.next(keys);
  }

  public get notActiveKeys(): string[] {
    return this.notActiveKeys$.value;
  }

  @Input() public searchText: string = 'Поиск...';

  @Output()
  public selectItemKey: EventEmitter<string> = new EventEmitter<string>();

  public itemsNode: TreeItemNode[] = [];

  public notActiveKeys$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  private readonly itemsCollection: Set<TreeItemNode> = new Set<TreeItemNode>();

  private readonly items$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly changeDetector: ChangeDetectorRef) {
    this.subscription
      .add(
        this.items$.subscribe(() => {
          this.setTreeItemNodes();
        })
      )
      .add(
        this.notActiveKeys$.subscribe(() => {
          this.checkedActive();
        })
      );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public valueChange(text: string): void {
    if (text === '') {
      this.itemsCollection.forEach(item => {
        item.enable = true;
        if (item.changeDetector) {
          item.changeDetector.markForCheck();
        }
      });
      return;
    }
    const search: Set<TreeItemNode> = new Set<TreeItemNode>(
      Array.from(this.itemsCollection).filter(item => item.value.toLowerCase().includes(text.toLowerCase()))
    );
    this.itemsCollection.forEach(item => {
      item.enable = false;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
    });
    search.forEach(item => {
      item.enable = true;
      item.opened = true;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
      this.openParent(item);
    });
    this.changeDetector.markForCheck();
  }

  private checkedActive(): void {
    this.itemsCollection.forEach(item => {
      item.active = true;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
    });
    this.itemsCollection.forEach(item => {
      if (!item.active) {
        return;
      }
      if (this.notActiveKeys.find(key => key === item.key)) {
        item.active = false;
        if (item.changeDetector) {
          item.changeDetector.markForCheck();
        }
        if (item.children && item.children.length > 0) {
          this.checkedActiveItem(item.children);
        }
      }
    });
    this.changeDetector.markForCheck();
  }

  private checkedActiveItem(items: TreeItemNode[]): void {
    items
      .filter(item => item.active)
      .forEach(item => {
        item.active = false;
        if (item.changeDetector) {
          item.changeDetector.markForCheck();
        }
        if (item.children && item.children.length > 0) {
          this.checkedActiveItem(item.children);
        }
      });
  }

  private openParent(item: TreeItemNode): void {
    if (item.parent !== null) {
      item.parent.enable = true;
      item.parent.opened = true;
      if (item.changeDetector) {
        item.changeDetector.markForCheck();
      }
      this.openParent(item.parent);
    }
  }

  private setTreeItemNodes(): void {
    this.itemsCollection.clear();
    this.itemsNode = [];
    this.setTreeItemNode(this.items);
  }

  private setTreeItemNode(items: any[], parent: TreeItemNode = null): void {
    items.forEach(item => {
      if (!item.key || !item.value || !item.icon) {
        return;
      }
      const itemNode: TreeItemNode = {
        enable: true,
        key: item.key,
        value: item.value,
        icon: item.icon,
        clickable: item.clickable === false ? false : true,
        children: [],
        parent,
        opened: false,
        active: true,
        changeDetector: null
      };
      if (parent !== null) {
        parent.children.push(itemNode);
      } else {
        this.itemsNode.push(itemNode);
      }
      this.itemsCollection.add(itemNode);
      if (item.children && item.children.length > 0) {
        this.setTreeItemNode(item.children, itemNode);
      }
    });
  }
}

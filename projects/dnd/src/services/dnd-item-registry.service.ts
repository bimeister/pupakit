import { Injectable } from '@angular/core';
import { DndItemConfig } from '../declarations/interfaces/dnd-item-config.interface';

@Injectable()
export class DndItemRegistryService {
  private readonly dndItemsRegistry: Map<string, DndItemConfig> = new Map<string, DndItemConfig>();

  public getDndItemConfig<T = unknown>(itemId: string): DndItemConfig<T> | undefined {
    return this.dndItemsRegistry.get(itemId) as DndItemConfig<T>;
  }

  public registerDndItem(itemId: string, itemConfig: DndItemConfig): void {
    this.dndItemsRegistry.set(itemId, itemConfig);
  }

  public unRegisterDndItem(itemId: string): void {
    this.dndItemsRegistry.delete(itemId);
  }
}

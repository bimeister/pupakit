import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { DND_ITEM_ID_ATTRIBUTE } from '../declarations/constants/dnd-item-id-attrIbute.const';
import { DndItemConfig } from '../declarations/interfaces/dnd-item-config.interface';
import { DndCanBeDroppableForFunc } from '../declarations/types/dnd-can-be-droppable-for-func.type';
import { DndCanBeMovedFunc } from '../declarations/types/dnd-can-be-moved-func.type';
import { DndItemRegistryService } from '../services/dnd-item-registry.service';
import { DndStartTriggerDirective } from './dnd-start-trigger.directive';

@Directive({
  selector: '[pupaDndItem]',
})
export class DndItemDirective<T> implements OnChanges, AfterViewInit, OnDestroy {
  @Input() public dndItemData: T;
  @Input() public dndItemIdGetter: (dndItemData: T) => string;

  @ContentChild(DndStartTriggerDirective) public dndStartTrigger: DndStartTriggerDirective | undefined;

  public dndItemId: string;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2,
    private readonly dndItemRegistryService: DndItemRegistryService
  ) {}

  @Input() public canBeMoved: DndCanBeMovedFunc<T> = () => true;
  @Input() public canBeDroppableFor: DndCanBeDroppableForFunc<T> = () => true;

  public ngOnChanges(changes: ComponentChanges<this>): void {
    this.processDndItemIdAndDataChanges(changes);
  }

  public ngAfterViewInit(): void {
    const dndItemConfig: DndItemConfig | undefined = this.dndItemRegistryService.getDndItemConfig(this.dndItemId);
    if (!isNil(dndItemConfig)) {
      dndItemConfig.dndItem.elementParts = [...dndItemConfig.dndItem.elementParts, this.elementRef.nativeElement];
      return;
    }

    this.dndItemRegistryService.registerDndItem(this.dndItemId, {
      dndItem: { id: this.dndItemId, data: this.dndItemData, elementParts: [this.elementRef.nativeElement] },
      canBeMoved: this.canBeMoved,
      canBeDroppableFor: this.canBeDroppableFor,
      dndStartTrigger: !isNil(this.dndStartTrigger) ? this.dndStartTrigger.elementRef.nativeElement : undefined,
    });
  }

  public ngOnDestroy(): void {
    this.dndItemRegistryService.unRegisterDndItem(this.dndItemId);
  }

  private processDndItemIdAndDataChanges(changes: ComponentChanges<this>): void {
    const dndItemDataChange: ComponentChange<this, T> | undefined = changes.dndItemData;
    if (isNil(dndItemDataChange)) {
      return;
    }

    this.dndItemId = this.dndItemIdGetter(dndItemDataChange.currentValue);

    this.renderer.setAttribute(this.elementRef.nativeElement, DND_ITEM_ID_ATTRIBUTE, this.dndItemId);

    const prevDndItemIdConfig: DndItemConfig | undefined = this.dndItemRegistryService.getDndItemConfig(this.dndItemId);
    if (isNil(prevDndItemIdConfig)) {
      return;
    }

    this.dndItemRegistryService.registerDndItem(this.dndItemId, {
      ...prevDndItemIdConfig,
      dndItem: {
        id: this.dndItemId,
        data: dndItemDataChange.currentValue,
        elementParts: prevDndItemIdConfig.dndItem.elementParts,
      },
    });
  }
}

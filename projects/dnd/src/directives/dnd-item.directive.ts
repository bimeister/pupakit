import {
  AfterViewInit,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';
import { DndItemTemplateContext } from '../declarations/interfaces/dnd-item-template-context.interface';
import { DndItemRegistryService } from '../services/dnd-item-registry.service';
import { DndCanBeMovedFunc } from '../declarations/types/dnd-can-be-moved-func.type';
import { DndCanBeDroppableForFunc } from '../declarations/types/dnd-can-be-droppable-for-func.type';
import { DND_ITEM_ID_ATTRIBUTE } from '../declarations/constants/dnd-item-id-attrIbute.const';
import { DndItemConfig } from '../declarations/interfaces/dnd-item-config.interface';
import { DndStartTriggerDirective } from './dnd-start-trigger.directive';

@Directive({
  selector: '[pupaDndItem]',
})
export class DndItemDirective<T> implements OnChanges, AfterViewInit, OnDestroy {
  @Input() public dndItemData: T;
  @Input() public dndItemId: string;
  @Input() public dndItemTemplateRef: TemplateRef<DndItemTemplateContext<T>>;

  @ContentChild(DndStartTriggerDirective) public dndStartTrigger: DndStartTriggerDirective | undefined;

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
    this.renderer.setAttribute(this.elementRef.nativeElement, DND_ITEM_ID_ATTRIBUTE, this.dndItemId);

    const dndItemConfig: DndItemConfig | undefined = this.dndItemRegistryService.getDndItemConfig(this.dndItemId);
    if (!isNil(dndItemConfig)) {
      dndItemConfig.dndItem.elementParts = [...dndItemConfig.dndItem.elementParts, this.elementRef.nativeElement];
      return;
    }

    this.dndItemRegistryService.registerDndItem(this.dndItemId, {
      dndItem: { id: this.dndItemId, data: this.dndItemData, elementParts: [this.elementRef.nativeElement] },
      itemTemplate: this.dndItemTemplateRef,
      canBeMoved: this.canBeMoved,
      canBeDroppableFor: this.canBeDroppableFor,
      dndStartTrigger: !isNil(this.dndStartTrigger) ? this.dndStartTrigger.elementRef.nativeElement : undefined,
    });
  }

  public ngOnDestroy(): void {
    this.dndItemRegistryService.unRegisterDndItem(this.dndItemId);
  }

  private processDndItemIdAndDataChanges(changes: ComponentChanges<this>): void {
    const dndItemIdChange: ComponentChange<this, string> | undefined = changes.dndItemId;
    const dndItemDataChange: ComponentChange<this, T> | undefined = changes.dndItemData;
    if (isNil(dndItemIdChange)) {
      return;
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, DND_ITEM_ID_ATTRIBUTE, dndItemIdChange.currentValue);

    if (isNil(dndItemDataChange) || isNil(dndItemIdChange.previousValue)) {
      return;
    }

    const prevDndItemIdConfig: DndItemConfig | undefined = this.dndItemRegistryService.getDndItemConfig(
      dndItemIdChange.previousValue
    );
    if (isNil(prevDndItemIdConfig)) {
      return;
    }

    this.dndItemRegistryService.unRegisterDndItem(dndItemIdChange.previousValue);
    this.dndItemRegistryService.registerDndItem(dndItemIdChange.currentValue, {
      ...prevDndItemIdConfig,
      dndItem: {
        id: dndItemIdChange.currentValue,
        data: dndItemDataChange.currentValue,
        elementParts: prevDndItemIdConfig.dndItem.elementParts,
      },
    });
  }
}

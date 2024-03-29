import { ConnectionPositionPair, FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { getUuid, isNil, Uuid } from '@bimeister/utilities';
import { take } from 'rxjs/operators';
import { DROPDOWN_CONTAINER_DATA_TOKEN } from '../declarations/tokens/dropdown-container-data.token';
import { DropdownContainerComponent } from '../components/dropdown/components/dropdown-container/dropdown-container.component';
import { DropdownTemplateComponent } from '../components/dropdown/components/dropdown-template/dropdown-template.component';
import { DropdownComponentBase } from '../declarations/classes/abstract/dropdown-component-base.abstract';
import { DropdownRef } from '../declarations/classes/dropdown-ref.class';
import { OpenedDropdown } from '../declarations/classes/opened-dropdown.class';
import { DropdownConfig } from '../declarations/interfaces/dropdown-config.interface';
import { DropdownContainerData } from '../declarations/interfaces/dropdown-container-data.interface';
import { DropdownDataType } from '../declarations/types/utility-types/dropdown-data.utility-type';
import { OVERLAY_VIEWPORT_MARGIN_PX, Position, Theme } from '@bimeister/pupakit.common';

const OVERLAY_POSITIONS: ConnectionPositionPair[] = [
  new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
  new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' }),
  new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
  new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
];

@Injectable({ providedIn: 'root' })
export class DropdownsService {
  private readonly dropdownStore: Map<string, DropdownRef> = new Map();

  constructor(protected readonly overlay: Overlay, protected readonly injector: Injector) {}

  public open<TComponent extends DropdownComponentBase<unknown>>(
    config: DropdownConfig<TComponent, DropdownDataType<TComponent>>
  ): OpenedDropdown {
    const dropdownId: Uuid = getUuid();
    const overlayRef: OverlayRef = this.getOverlayRef(config);
    const dropdownRef: DropdownRef<DropdownDataType<TComponent>> = new DropdownRef(overlayRef, config);
    const containerPortal: ComponentPortal<DropdownContainerComponent> = this.getComponentPortal(config, dropdownRef);

    dropdownRef.open(containerPortal);

    this.dropdownStore.set(dropdownId, dropdownRef);

    dropdownRef.closed$.pipe(take(1)).subscribe(() => {
      this.dropdownStore.delete(dropdownId);
      overlayRef.dispose();
    });

    return new OpenedDropdown(dropdownId, dropdownRef);
  }

  public closeById(id: string): void {
    const dropdownRef: DropdownRef = this.dropdownStore.get(id);

    if (isNil(dropdownRef)) {
      return;
    }

    dropdownRef.close();
  }

  public closeAll(): void {
    this.dropdownStore.forEach((dropdownRef: DropdownRef) => dropdownRef.close());
  }

  public isOpen(id: string): boolean {
    return this.dropdownStore.has(id);
  }

  private getComponentPortal<TComponent extends DropdownComponentBase<unknown>>(
    config: DropdownConfig<TComponent, DropdownDataType<TComponent>>,
    dropdownRef: DropdownRef<DropdownDataType<TComponent>>
  ): ComponentPortal<DropdownContainerComponent> {
    const injector: Injector = Injector.create({
      parent: config.injector ?? this.injector,
      providers: [{ provide: DropdownRef, useValue: dropdownRef }],
    });

    const componentPortal: ComponentPortal<unknown> = new ComponentPortal<unknown>(
      config.component ?? DropdownTemplateComponent,
      null,
      injector
    );

    const containerData: DropdownContainerData<unknown> = {
      componentPortal,
      theme: config.theme ?? Theme.Light,
    };

    return new ComponentPortal(
      DropdownContainerComponent,
      null,
      Injector.create({
        providers: [{ provide: DROPDOWN_CONTAINER_DATA_TOKEN, useValue: containerData }],
      })
    );
  }

  private getOverlayRef<TComponent extends DropdownComponentBase<unknown>>(
    config: DropdownConfig<TComponent, DropdownDataType<TComponent>>
  ): OverlayRef {
    return this.overlay.create({
      width: this.getOverlayWidth(config),
      positionStrategy: this.getTargetPosition(config),
    });
  }

  private getTargetPosition<TComponent extends DropdownComponentBase<unknown>>(
    config: DropdownConfig<TComponent, DropdownDataType<TComponent>>
  ): FlexibleConnectedPositionStrategy {
    const target: HTMLElement | Position = config.target;

    return this.overlay
      .position()
      .flexibleConnectedTo(target instanceof HTMLElement ? target : { x: target[0], y: target[1] })
      .withFlexibleDimensions(false)
      .withPositions(this.getOverlayPositions(config))
      .withViewportMargin(OVERLAY_VIEWPORT_MARGIN_PX);
  }

  private getOverlayWidth<TComponent extends DropdownComponentBase<unknown>>(
    config: DropdownConfig<TComponent, DropdownDataType<TComponent>>
  ): string | number {
    const target: HTMLElement | Position = config.target;

    if (target instanceof HTMLElement && config.widthType === 'by-trigger') {
      const { width } = target.getBoundingClientRect();
      return width;
    }

    return 'auto';
  }

  private getOverlayPositions<TComponent extends DropdownComponentBase<unknown>>(
    config: DropdownConfig<TComponent, DropdownDataType<TComponent>>
  ): ConnectionPositionPair[] {
    const sortedHorizontalPositions: ConnectionPositionPair[] = OVERLAY_POSITIONS.sort(
      (position: ConnectionPositionPair) =>
        position.overlayX === config.horizontalPosition &&
        position.originY === config.verticalPosition &&
        position.overlayY !== config.verticalPosition
          ? -1
          : 1
    );

    return sortedHorizontalPositions;
  }
}

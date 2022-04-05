import { ConnectionPositionPair, FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector } from '@angular/core';
import { getUuid, isNil, Uuid } from '@bimeister/utilities';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DROPDOWN_CONTAINER_DATA_TOKEN } from '../../../internal/constants/tokens/dropdown-container-data.token';
import { DropdownContainerComponent } from '../../../lib/components/dropdown/components/dropdown-container/dropdown-container.component';
import { DropdownTemplateComponent } from '../../../lib/components/dropdown/components/dropdown-template/dropdown-template.component';
import { Theme } from '../../../internal/declarations/enums/theme.enum';
import { DropdownComponentBase } from '../../declarations/classes/abstract/dropdown-component-base.abstract';
import { DropdownRef } from '../../declarations/classes/dropdown-ref.class';
import { OpenedDropdown } from '../../declarations/classes/opened-dropdown.class';
import { DropdownConfig } from '../../declarations/interfaces/dropdown-config.interface';
import { DropdownContainerData } from '../../declarations/interfaces/dropdown-container-data.interface';
import { Position } from '../../declarations/types/position.type';
import { DropdownDataType } from '../../declarations/types/utility-types/dropdown-data.utility-type';

const DROPDOWN_POSITIONS: ConnectionPositionPair[] = [
  new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
  new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
  new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
];

@Injectable({ providedIn: 'root' })
export class DropdownsService {
  private readonly dropdownStore: Map<string, DropdownRef> = new Map();
  private readonly theme$: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(Theme.Light);

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

  public setTheme(theme: Theme): void {
    this.theme$.next(theme);
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
      theme$: this.theme$,
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
    const target: ElementRef | Position = config.target;

    return target instanceof ElementRef
      ? this.getFlexiblePositionStrategy(target)
      : this.getCoordinatesPositionStrategy(target);
  }

  private getFlexiblePositionStrategy(target: ElementRef): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(target)
      .withFlexibleDimensions(true)
      .withPositions(DROPDOWN_POSITIONS);
  }

  private getCoordinatesPositionStrategy([x, y]: Position): FlexibleConnectedPositionStrategy {
    return this.overlay.position().flexibleConnectedTo({ x, y }).withPositions(DROPDOWN_POSITIONS);
  }

  private getOverlayWidth<TComponent extends DropdownComponentBase<unknown>>(
    config: DropdownConfig<TComponent, DropdownDataType<TComponent>>
  ): string | number {
    const target: ElementRef<HTMLElement> | Position = config.target;

    if (target instanceof ElementRef && config.widthType === 'by-trigger') {
      const { width } = target.nativeElement.getBoundingClientRect();
      return width;
    }

    return 'auto';
  }
}

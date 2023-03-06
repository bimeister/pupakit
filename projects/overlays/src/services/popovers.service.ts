import { Overlay } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Injector, RendererFactory2 } from '@angular/core';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { PopoverComponentBase } from '../declarations/classes/abstract/popover-component-base.abstract';
import { OpenedPopover } from '../declarations/classes/opened-popover.class';
import { PopoverRef } from '../declarations/classes/popover-ref.class';
import { Popover } from '../declarations/classes/popover.class';
import { PopoverConfig } from '../declarations/interfaces/popover-config.interface';
import { PopoverDataType } from '../declarations/types/utility-types/popover-data.utility-type';
import { PopoverReturnType } from '../declarations/types/utility-types/popover-return.utility-type';
import { PortalLayersService } from './portal-layers.service';

@Injectable({ providedIn: 'root' })
export class PopoversService {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    protected readonly overlay: Overlay,
    protected readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2,
    private readonly portalLayersService: PortalLayersService
  ) {}

  public open<TComponent extends PopoverComponentBase<unknown, unknown>>(
    config: PopoverConfig<TComponent, PopoverDataType<TComponent>>
  ): OpenedPopover<PopoverReturnType<TComponent>> {
    const popover: Popover<TComponent> = new Popover(
      config,
      this.overlay,
      this.injector,
      this.rendererFactory,
      this.clientUiStateHandlerService,
      this.document
    );

    const popoverRef: PopoverRef<PopoverDataType<TComponent>, PopoverReturnType<TComponent>> = popover.open();

    this.portalLayersService.register(popover);
    this.portalLayersService.moveToTopById(popover.id);

    popoverRef.closed$.subscribe(() => {
      this.portalLayersService.removeById(popover.id);
    });

    return new OpenedPopover(popover.id, popoverRef);
  }

  public updateOverlayPosition(popoverId?: string): void {
    const popover: unknown = isNil(popoverId)
      ? this.portalLayersService.getTopLayer()
      : this.portalLayersService.getLayerById(popoverId);

    if (popover instanceof Popover) {
      popover.updateOverlayPosition();
    }
  }
}

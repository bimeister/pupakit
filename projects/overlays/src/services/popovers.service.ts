import { Overlay } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { ClientUiStateHandlerService, Position } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { PopoverComponentBase } from '../declarations/classes/abstract/popover-component-base.abstract';
import { OpenedPopover } from '../declarations/classes/opened-popover.class';
import { PopoverRef } from '../declarations/classes/popover-ref.class';
import { Popover } from '../declarations/classes/popover.class';
import { PopoverConfig } from '../declarations/interfaces/popover-config.interface';
import { PopoverDataType } from '../declarations/types/utility-types/popover-data.utility-type';
import { PopoverReturnType } from '../declarations/types/utility-types/popover-return.utility-type';
import { PortalLayersService } from './portal-layers.service';
import { PopoverTrigger } from '../declarations/interfaces/popover-trigger.interface';
import { DEFAULT_POPOVER_TRIGGER_CSS_CLASS } from '../declarations/constants/default-popover-trigger-css-class.const';

@Injectable({ providedIn: 'root' })
export class PopoversService {
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);
  private readonly popoverRefByAnchor: Map<ElementRef<HTMLElement> | Position, Popover<any>> = new Map();

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
    const anchor: ElementRef<HTMLElement> | Position = config.anchor;
    const isExists: boolean = this.popoverRefByAnchor.has(anchor);

    const popover: Popover<TComponent> = this.getPopover(config);
    const popoverRef: PopoverRef<PopoverDataType<TComponent>, PopoverReturnType<TComponent>> = popover.open(isExists);

    this.addCssClassToPopoverTrigger(config.trigger);
    this.portalLayersService.moveToTopById(popover.id);

    popoverRef.closed$.subscribe(() => {
      this.removeCssClassFromPopoverTrigger(config.trigger);
      this.portalLayersService.removeById(popover.id);
      this.popoverRefByAnchor.delete(anchor);
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

  private getPopover<TComponent extends PopoverComponentBase<unknown, unknown>>(
    config: PopoverConfig<TComponent, PopoverDataType<TComponent>>
  ): Popover<TComponent> {
    const isExists: boolean = this.popoverRefByAnchor.has(config.anchor);
    return isExists ? this.popoverRefByAnchor.get(config.anchor) : this.createPopover(config);
  }

  private createPopover<TComponent extends PopoverComponentBase<unknown, unknown>>(
    config: PopoverConfig<TComponent, PopoverDataType<TComponent>>
  ): Popover<TComponent> {
    const popover: Popover<TComponent> = new Popover(
      config,
      this.overlay,
      this.injector,
      this.rendererFactory,
      this.clientUiStateHandlerService,
      this.document
    );

    this.registerPopover(popover, config.anchor);

    return popover;
  }

  private registerPopover<TComponent extends PopoverComponentBase<unknown, unknown>>(
    popover: Popover<TComponent>,
    anchor: ElementRef<HTMLElement> | Position
  ): void {
    this.popoverRefByAnchor.set(anchor, popover);
    this.portalLayersService.register(popover);
  }

  private addCssClassToPopoverTrigger(trigger?: PopoverTrigger): void {
    if (isNil(trigger?.element)) {
      return;
    }
    this.renderer.addClass(trigger.element, trigger.cssClass ?? DEFAULT_POPOVER_TRIGGER_CSS_CLASS);
  }

  private removeCssClassFromPopoverTrigger(trigger?: PopoverTrigger): void {
    if (isNil(trigger?.element)) {
      return;
    }
    this.renderer.removeClass(trigger.element, trigger.cssClass ?? DEFAULT_POPOVER_TRIGGER_CSS_CLASS);
  }
}

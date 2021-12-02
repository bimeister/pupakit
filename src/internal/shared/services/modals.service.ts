import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { Injectable, Injector, RendererFactory2 } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { ModalConfigDto } from '../../declarations/classes/dto/modal-config.dto';
import { ModalRef } from '../../declarations/classes/modal-ref.class';
import { Modal } from '../../declarations/classes/modal.class';
import { ModalConfig } from '../../declarations/interfaces/modal-config.interface';
import { OpenedModal } from '../../declarations/interfaces/opened-modal.interface';
import { Position } from '../../declarations/types/position.type';
import { PortalLayersService } from './portal-layers.service';

@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  protected readonly modalRefs: Map<string, ModalRef<unknown>> = new Map();

  public get openedCount(): number {
    return this.modalRefs.size;
  }

  constructor(
    protected readonly overlay: Overlay,
    protected readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2,
    private readonly portalLayersService: PortalLayersService
  ) {}

  public open<ComponentT, ReturnDataT>(
    component: ComponentType<ComponentT>,
    config: Partial<ModalConfig> = null
  ): OpenedModal<ReturnDataT> {
    const configDto: ModalConfigDto = new ModalConfigDto(config);

    const modal: Modal<ComponentT> = new Modal(component, configDto, this.overlay, this.injector, this.rendererFactory);
    this.portalLayersService.register(modal);
    this.portalLayersService.moveToTopById(modal.id);

    const modalRef: ModalRef<ReturnDataT> = modal.open();
    this.modalRefs.set(modal.id, modalRef);

    this.processModalClosed(modal);
    this.processModalPositionUpdated(modal);
    this.processModalToTopLayerMoved(modal);

    return {
      id: modal.id,
      closed$: modalRef.closed$,
      positionUpdated$: modalRef.positionUpdated$,
    };
  }

  public closeById(id: string): void {
    const modalRef: ModalRef<unknown> = this.modalRefs.get(id);

    if (isNil(modalRef)) {
      return;
    }

    modalRef.close(null);
  }

  public closeAll(): void {
    this.modalRefs.forEach((modalRef: ModalRef<unknown>) => modalRef.close(null));
  }

  private processModalClosed(modal: Modal<unknown>): void {
    const modalRef: ModalRef<unknown> = this.modalRefs.get(modal.id);
    modalRef.closed$.subscribe(() => {
      this.portalLayersService.removeById(modal.id);
      this.modalRefs.delete(modal.id);
    });
  }

  private processModalPositionUpdated(modal: Modal<unknown>): void {
    const modalRef: ModalRef<unknown> = this.modalRefs.get(modal.id);
    modalRef.positionUpdated$.subscribe((position: Position) => modal.updatePosition(position));
  }

  private processModalToTopLayerMoved(modal: Modal<unknown>): void {
    const modalRef: ModalRef<unknown> = this.modalRefs.get(modal.id);
    modalRef.toTopLayerMoved$.subscribe(() => this.portalLayersService.moveToTopById(modalRef.modalId));
  }
}

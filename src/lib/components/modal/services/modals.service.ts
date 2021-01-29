import { ComponentType, Overlay } from '@angular/cdk/overlay';
import { Injectable, Injector } from '@angular/core';
import { isNil } from '@bimeister/utilities/commonjs/common';
import { ModalConfigDto } from '../../../../internal/declarations/classes/dto/modal-config.dto';
import { ModalRef } from '../../../../internal/declarations/classes/modal-ref.class';
import { Modal } from '../../../../internal/declarations/classes/modal.class';
import { ModalConfig } from '../../../../internal/declarations/interfaces/modal-config.interface';
import { OpenedModal } from '../../../../internal/declarations/interfaces/opened-modal.interface';
import { Position } from '../../../../internal/declarations/types/position.type';

@Injectable({
  providedIn: 'root'
})
export class ModalsService {
  protected readonly modalRefs: Map<string, ModalRef<unknown>> = new Map();

  public get openedCount(): number {
    return this.modalRefs.size;
  }

  constructor(protected readonly overlay: Overlay, protected readonly injector: Injector) {}

  public open<ComponentT, ReturnDataT>(
    component: ComponentType<ComponentT>,
    config: Partial<ModalConfig> = null
  ): OpenedModal<ReturnDataT> {
    const configDto: ModalConfigDto = new ModalConfigDto(config);

    const modal: Modal<ComponentT> = new Modal(component, configDto, this.overlay, this.injector);

    const modalRef: ModalRef<ReturnDataT> = modal.open();
    this.modalRefs.set(modal.getId(), modalRef);

    modalRef.closed$.subscribe(() => this.modalRefs.delete(modal.getId()));
    modalRef.positionUpdated$.subscribe((position: Position) => modal.updatePosition(position));

    return {
      id: modal.getId(),
      closed$: modalRef.closed$,
      positionUpdated$: modalRef.positionUpdated$
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
}

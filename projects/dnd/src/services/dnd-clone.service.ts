import { ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { DndCloneContainerComponent } from '../components/dnd-clone-container/dnd-clone-container.component';
import { DndCloneData } from '../declarations/interfaces/dnd-clone-data.interface';
import { DND_CLONE_CONTAINER_DATA_TOKEN } from '../declarations/tokens/dnd-clone-container-data.token';

const DEFAULT_CONNECTED_POSITION: ConnectedPosition = {
  originX: 'start',
  originY: 'top',
  overlayX: 'start',
  overlayY: 'top',
};

@Injectable({ providedIn: 'root' })
export class DndCloneService {
  private overlayRef: OverlayRef | null = null;

  constructor(private readonly overlay: Overlay, private readonly rendererFactory: RendererFactory2) {}

  public create<T>(dndCloneData: DndCloneData<T>, parentInjector: Injector): void {
    this.destroy();

    this.overlayRef = this.createOverlay(dndCloneData, parentInjector);
  }

  public updatePosition([clientX, clientY]: [number, number], connectedPosition?: ConnectedPosition): void {
    this.overlayRef?.updatePositionStrategy(this.getPositionStrategy([clientX, clientY], connectedPosition));
  }

  public destroy(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  private createOverlay<T>(dndCloneData: DndCloneData<T>, parentInjector: Injector): OverlayRef {
    const overlayRef: OverlayRef = this.overlay.create({
      positionStrategy: this.getPositionStrategy([0, 0]),
      width: dndCloneData.widthPx !== 0 && `${dndCloneData.widthPx}px`,
      height: dndCloneData.heightPx !== 0 && `${dndCloneData.heightPx}px`,
    });
    const injector: Injector = Injector.create({
      providers: [
        {
          provide: DND_CLONE_CONTAINER_DATA_TOKEN,
          useValue: {
            templateRef: dndCloneData.templateRef,
            templateContext: dndCloneData.templateContext,
          },
        },
      ],
      parent: parentInjector,
    });

    const componentPortal: ComponentPortal<DndCloneContainerComponent<T>> = new ComponentPortal<
      DndCloneContainerComponent<T>
    >(DndCloneContainerComponent, null, injector);

    overlayRef.attach(componentPortal);

    const renderer: Renderer2 = this.rendererFactory.createRenderer(overlayRef.overlayElement, null);
    renderer.setStyle(overlayRef.overlayElement, 'pointer-events', 'none');

    return overlayRef;
  }

  private getPositionStrategy(
    [positionX, positionY]: [number, number],
    connectedPosition?: ConnectedPosition
  ): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo({ x: positionX, y: positionY })
      .withPositions([connectedPosition ?? DEFAULT_CONNECTED_POSITION]);
  }
}

import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { DndCloneContainerComponent } from '../components/dnd-clone-container/dnd-clone-container.component';
import { DndCloneData } from '../declarations/interfaces/dnd-clone-data.interface';
import { DndCloneContainerData } from '../declarations/interfaces/dnd-clone-container-data.interface';
import { DND_CLONE_CONTAINER_DATA_TOKEN } from '../declarations/tokens/dnd-clone-container-data.token';

const DEFAULT_CONNECTED_POSITION: ConnectedPosition = {
  originX: 'start',
  originY: 'top',
  overlayX: 'start',
  overlayY: 'top',
};

@Injectable({ providedIn: 'root' })
export class DndCloneService {
  private overlays: OverlayRef[] = [];

  constructor(private readonly overlay: Overlay, private readonly rendererFactory: RendererFactory2) {}

  public create<T>(dndCloneDataList: DndCloneData<T>[], parentInjector: Injector): void {
    this.destroy();

    this.overlays = this.createOverlays(dndCloneDataList, parentInjector);
  }

  public updatePosition(
    [clientX, clientY]: [number, number],
    overlayYOffset: number = 0,
    connectedPosition?: ConnectedPosition
  ): void {
    let nextOverlayYPosition: number = clientY;
    this.overlays.forEach((overlay: OverlayRef) => {
      const overlayConfig: OverlayConfig = overlay.getConfig();
      overlay.updatePositionStrategy(this.getPositionStrategy([clientX, nextOverlayYPosition], connectedPosition));
      nextOverlayYPosition += parseInt(overlayConfig.height.toString(), 10) + overlayYOffset;
    });
  }

  public destroy(): void {
    this.overlays.forEach((overlay: OverlayRef) => overlay.dispose());
    this.overlays = [];
  }

  private createOverlays<T>(dndCloneDataList: DndCloneData<T>[], parentInjector: Injector): OverlayRef[] {
    const overlays: OverlayRef[] = dndCloneDataList.map((dndCloneData: DndCloneData<T>) => {
      const overlay: OverlayRef = this.overlay.create({
        positionStrategy: this.getPositionStrategy([0, 0]),
        width: dndCloneData.widthPx !== 0 && `${dndCloneData.widthPx}px`,
        height: dndCloneData.heightPx !== 0 && `${dndCloneData.heightPx}px`,
      });

      const dndCloneContainerData: DndCloneContainerData<T> = {
        templateRef: dndCloneData.templateRef,
        templateContext: dndCloneData.templateContext,
      };

      const injector: Injector = Injector.create({
        providers: [
          {
            provide: DND_CLONE_CONTAINER_DATA_TOKEN,
            useValue: dndCloneContainerData,
          },
        ],
        parent: parentInjector,
      });

      const componentPortal: ComponentPortal<DndCloneContainerComponent<T>> = new ComponentPortal<
        DndCloneContainerComponent<T>
      >(DndCloneContainerComponent, null, injector);

      overlay.attach(componentPortal);

      return overlay;
    });

    overlays.forEach(({ overlayElement }: OverlayRef) => {
      const renderer: Renderer2 = this.rendererFactory.createRenderer(overlayElement, null);
      renderer.setStyle(overlayElement, 'pointer-events', 'none');
    });

    return overlays;
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

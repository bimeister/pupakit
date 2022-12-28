import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { DndCloneContainerComponent } from '../components/dnd/components/dnd-clone-container/dnd-clone-container.component';
import { DndCloneContainerData } from '../declarations/interfaces/dnd-clone-container-data.interface';
import { DND_CLONE_CONTAINER_DATA_TOKEN } from '../declarations/tokens/dnd-clone-container-data.token';
import { DndCloneData } from '../declarations/interfaces/dnd-clone-data.interface';

@Injectable({ providedIn: 'root' })
export class DndCloneService {
  private overlays: OverlayRef[] = [];

  constructor(private readonly overlay: Overlay, private readonly rendererFactory: RendererFactory2) {}

  public create<T>(dndCloneDataList: DndCloneData<T>[], parentInjector: Injector): void {
    this.destroy();

    this.overlays = this.createOverlays(dndCloneDataList, parentInjector);
  }

  public updatePosition(
    position: [number, number],
    overlayYOffset: number = 0,
    connectedPosition?: ConnectedPosition
  ): void {
    let nextOverlayYPosition: number = position[1];
    this.overlays.forEach((overlay: OverlayRef) => {
      const overlayConfig: OverlayConfig = overlay.getConfig();
      overlay.updatePositionStrategy(this.getPositionStrategy([position[0], nextOverlayYPosition], connectedPosition));
      nextOverlayYPosition += parseInt(overlayConfig.height as string, 10) + overlayYOffset;
    });
  }

  public destroy(): void {
    this.overlays.forEach((overlay: OverlayRef) => overlay.dispose());
    this.overlays = [];
  }

  private createOverlays<T>(dndCloneDataList: DndCloneData<T>[], parentInjector: Injector): OverlayRef[] {
    const overlays: OverlayRef[] = [];

    for (const dndCloneData of dndCloneDataList) {
      const overlay: OverlayRef = this.overlay.create({
        positionStrategy: this.getPositionStrategy([0, 0]),
        width: dndCloneData.widthPx !== 0 && `${dndCloneData.widthPx}px`,
        height: dndCloneData.heightPx !== 0 && `${dndCloneData.heightPx}px`,
      });
      overlays.push(overlay);

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
      const overlayElement: HTMLElement = overlay.overlayElement;
      const renderer: Renderer2 = this.rendererFactory.createRenderer(overlayElement, null);
      renderer.setStyle(overlayElement, 'pointer-events', 'none');
    }

    return overlays;
  }

  private getPositionStrategy(
    position: [number, number],
    connectedPosition?: ConnectedPosition
  ): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo({ x: position[0], y: position[1] })
      .withPositions([
        {
          originX: connectedPosition?.originX ?? 'start',
          originY: connectedPosition?.originY ?? 'top',
          overlayX: connectedPosition?.overlayX ?? 'start',
          overlayY: connectedPosition?.overlayY ?? 'top',
        },
      ]);
  }
}

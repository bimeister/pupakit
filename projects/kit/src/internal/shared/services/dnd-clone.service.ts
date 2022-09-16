import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, Renderer2, RendererFactory2, TemplateRef } from '@angular/core';
import { DndCloneContainerComponent } from '../../../lib/components/dnd-clone-container/components/dnd-clone-container/dnd-clone-container.component';
import { DND_CLONE_CONTAINER_DATA_TOKEN } from '../../constants/tokens/dnd-clone-container-data.token';
import { DndCloneContainerData } from '../../../internal/declarations/interfaces/dnd-clone-container-data.interface';

@Injectable({ providedIn: 'root' })
export class DndCloneService {
  private overlayRef: OverlayRef | null = null;

  constructor(private readonly overlay: Overlay, private readonly rendererFactory: RendererFactory2) {}

  public create<C>(
    templateRef: TemplateRef<C>,
    data: C,
    widthPx: number,
    heightPx: number,
    parentInjector: Injector
  ): void {
    this.destroy();

    this.overlayRef = this.overlay.create({
      positionStrategy: this.getPositionStrategy([0, 0]),
      width: `${widthPx}px`,
      height: `${heightPx}px`,
    });

    const dndCloneContainerData: DndCloneContainerData<C> = {
      templateRef,
      templateContext: data,
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

    const componentPortal: ComponentPortal<DndCloneContainerComponent<C>> = new ComponentPortal<
      DndCloneContainerComponent<C>
    >(DndCloneContainerComponent, null, injector);

    this.overlayRef.attach(componentPortal);
    const overlayElement: HTMLElement = this.overlayRef.overlayElement;
    const renderer: Renderer2 = this.rendererFactory.createRenderer(overlayElement, null);
    renderer.setStyle(overlayElement, 'pointer-events', 'none');
  }

  public updatePosition(position: [number, number]): void {
    this.overlayRef?.updatePositionStrategy(this.getPositionStrategy(position));
  }

  public destroy(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  private getPositionStrategy(position: [number, number]): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo({ x: position[0], y: position[1] })
      .withPositions([{ overlayX: 'center', overlayY: 'center', originX: 'center', originY: 'center' }]);
  }
}

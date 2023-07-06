import { Injectable, NgZone, RendererFactory2 } from '@angular/core';
import { PupaModalViewportBoundaryPositionStrategy } from '../declarations/classes/pupa-modal-viewport-boundary-position-strategy.class';
import { PupaModalViewport } from '../declarations/types/pupa-modal-viewport.type';

@Injectable({ providedIn: 'root' })
export class ModalPositionStrategyBuilder {
  constructor(private readonly ngZone: NgZone, private readonly rendererFactory: RendererFactory2) {}

  public pupaModalViewportBoundary(viewport: PupaModalViewport): PupaModalViewportBoundaryPositionStrategy {
    return new PupaModalViewportBoundaryPositionStrategy(viewport, this.rendererFactory, this.ngZone);
  }
}

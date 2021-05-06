import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

import { Position } from '../types/position.type';
import { ModalConfig } from '../interfaces/modal-config.interface';
import { ConnectedPositionY } from '../types/connected-position-y.type';
import { ConnectedPositionX } from '../types/connected-position-x.type';

export class ModalRef<ReturnDataT = null> {
  public readonly closed$: Subject<ReturnDataT> = new Subject<ReturnDataT>();
  public readonly positionUpdated$: Subject<Position> = new Subject<Position>();
  public readonly toTopLayerMoved$: Subject<void> = new Subject();

  constructor(
    public readonly modalId: string,
    private readonly overlayRef: OverlayRef,
    private readonly config: ModalConfig
  ) {}

  public moveToTopLayer(): void {
    this.toTopLayerMoved$.next();
  }

  public getOverlayHtmlElement(): HTMLElement {
    return this.overlayRef.overlayElement;
  }

  public getOverlayXPosition(): ConnectedPositionX {
    return this.config.overlayX;
  }

  public getOverlayYPosition(): ConnectedPositionY {
    return this.config.overlayY;
  }

  public updatePosition(newPosition: Position): void {
    this.positionUpdated$.next(newPosition);
  }

  public close(data: ReturnDataT = null): void {
    this.overlayRef.dispose();
    this.closed$.next(data);

    this.closed$.complete();
    this.positionUpdated$.complete();
    this.toTopLayerMoved$.complete();
  }
}

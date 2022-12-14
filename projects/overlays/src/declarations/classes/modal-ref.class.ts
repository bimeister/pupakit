import { OverlayRef } from '@angular/cdk/overlay';
import { Position } from '@bimeister/pupakit.common';
import { BehaviorSubject, Subject } from 'rxjs';
import { ModalConfig } from '../interfaces/modal-config.interface';
import { ConnectedPositionX } from '../types/connected-position-x.type';
import { ConnectedPositionY } from '../types/connected-position-y.type';

export class ModalRef<ReturnDataT = null> {
  public readonly closed$: Subject<ReturnDataT> = new Subject<ReturnDataT>();
  public readonly opened$: Subject<void> = new Subject<void>();
  public readonly positionUpdated$: Subject<Position> = new Subject<Position>();
  public readonly toTopLayerMoved$: Subject<void> = new Subject();
  public readonly isFullscreen$: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

  public changeFullscreenMode(isFullscreen: boolean): void {
    this.isFullscreen$.next(isFullscreen);
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

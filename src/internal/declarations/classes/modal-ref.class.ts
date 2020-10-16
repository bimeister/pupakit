import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

import { Position } from '../types/position.type';

export class ModalRef<ReturnDataT = null> {
  public readonly closed$: Subject<ReturnDataT> = new Subject();
  public readonly positionUpdated$: Subject<Position> = new Subject();

  constructor(private readonly overlayRef: OverlayRef) {}

  public updatePosition(newPosition: Position): void {
    this.positionUpdated$.next(newPosition);
  }

  public close(data: ReturnDataT = null): void {
    this.overlayRef.dispose();
    this.closed$.next(data);

    this.closed$.complete();
    this.positionUpdated$.complete();
  }
}

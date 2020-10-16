import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class DrawerRef<ReturnDataT = null> {
  public readonly closed$: Subject<ReturnDataT> = new Subject();

  constructor(private readonly overlayRef: OverlayRef) {}

  public close(data: ReturnDataT = null): void {
    this.overlayRef.dispose();
    this.closed$.next(data);

    this.closed$.complete();
  }
}

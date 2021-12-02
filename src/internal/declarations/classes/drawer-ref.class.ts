import { OverlayRef } from '@angular/cdk/overlay';
import { BehaviorSubject, Subject } from 'rxjs';

export class DrawerRef<ReturnDataT = null> {
  public readonly closed$: Subject<ReturnDataT> = new Subject();

  public readonly isFullscreen$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private readonly overlayRef: OverlayRef) {}

  public close(data: ReturnDataT = null): void {
    this.overlayRef.dispose();
    this.closed$.next(data);

    this.closed$.complete();
  }

  public changeFullscreenMode(isFullscreen: boolean): void {
    this.isFullscreen$.next(isFullscreen);
  }
}

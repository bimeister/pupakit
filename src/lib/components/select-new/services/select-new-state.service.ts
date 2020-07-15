import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'any'
})
export class SelectNewStateService {
  public readonly isExpanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly dropDownOverlayOrigin$: BehaviorSubject<CdkOverlayOrigin> = new BehaviorSubject<CdkOverlayOrigin>(
    null
  );

  public collapse(): void {
    this.isExpanded$.next(false);
  }

  public toggleExpansion(): void {
    this.isExpanded$.pipe(take(1)).subscribe((isExpanded: boolean) => {
      this.isExpanded$.next(!isExpanded);
    });
  }

  public defineOverlayOrigin(overlayOrigin: CdkOverlayOrigin): void {
    this.dropDownOverlayOrigin$.next(overlayOrigin);
  }
}

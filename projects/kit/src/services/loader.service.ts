import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoaderType } from '../declarations/types/loader-type.type';
import { filterNotNil } from '@bimeister/utilities';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly loaderVisibilityState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly loaderTypeState$: BehaviorSubject<LoaderType> = new BehaviorSubject<LoaderType | null>(null);
  private readonly loaderOverlayTopOffsetPxState$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(
    null
  );
  private readonly loaderOverlayLeftOffsetPxState$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(
    null
  );
  public readonly isLoaderVisible$: Observable<boolean> = this.loaderVisibilityState$;
  public readonly loaderType$: Observable<LoaderType | null> = this.loaderTypeState$;
  public readonly loaderOverlayTopOffsetPx$: Observable<number> = this.loaderOverlayTopOffsetPxState$.pipe(
    filterNotNil()
  );
  public readonly loaderOverlayLeftOffsetPx$: Observable<number> = this.loaderOverlayLeftOffsetPxState$.pipe(
    filterNotNil()
  );

  public setLoaderState(value: boolean, type: LoaderType = 'transparent', overlayTopOffsetPx: number = 0): void {
    this.loaderVisibilityState$.next(value);
    this.loaderTypeState$.next(value ? type : null);
    this.loaderOverlayTopOffsetPxState$.next(overlayTopOffsetPx);
  }

  public setLoaderOffset(overlayTopOffsetPx: number, overlayLeftOffsetPx: number): void {
    this.loaderOverlayTopOffsetPxState$.next(overlayTopOffsetPx);
    this.loaderOverlayLeftOffsetPxState$.next(overlayLeftOffsetPx);
  }

  public showLoader(type: LoaderType = 'transparent', overlayTopOffsetPx: number = 0): void {
    this.setLoaderState(true, type, overlayTopOffsetPx);
  }

  public hideLoader(): void {
    this.setLoaderState(false);
  }
}

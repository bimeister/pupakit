import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoaderType } from '../../declarations/types/loader-type.type';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loaderVisibilityState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly loaderTypeState$: BehaviorSubject<LoaderType> = new BehaviorSubject<LoaderType>(null);
  private readonly loaderOverlayTopOffsetPxState$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public readonly isLoaderVisible$: Observable<boolean> = this.loaderVisibilityState$;
  public readonly loaderType$: Observable<LoaderType> = this.loaderTypeState$;
  public readonly loaderOverlayTopOffsetPx$: Observable<number> = this.loaderOverlayTopOffsetPxState$;

  public setLoaderState(value: boolean, type: LoaderType = 'transparent', overlayTopOffsetPx: number = 0): void {
    this.loaderVisibilityState$.next(value);
    this.loaderTypeState$.next(value ? type : null);
    this.loaderOverlayTopOffsetPxState$.next(overlayTopOffsetPx);
  }

  public showLoader(type: LoaderType = 'transparent', overlayTopOffsetPx: number = 0): void {
    this.setLoaderState(true, type, overlayTopOffsetPx);
  }

  public hideLoader(): void {
    this.setLoaderState(false);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LoaderType } from './../../../internal';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loaderVisibilityState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly loaderTypeState$: BehaviorSubject<LoaderType> = new BehaviorSubject<LoaderType>(null);
  public readonly isLoaderVisible$: Observable<boolean> = this.loaderVisibilityState$;
  public readonly loaderType$: Observable<LoaderType> = this.loaderTypeState$;

  public setLoaderState(value: boolean, type: LoaderType = 'transparent'): void {
    this.loaderVisibilityState$.next(value);
    this.loaderTypeState$.next(value ? type : null);
  }

  public showLoader(type: LoaderType = 'transparent'): void {
    this.setLoaderState(true, type);
  }

  public hideLoader(): void {
    this.setLoaderState(false);
  }
}

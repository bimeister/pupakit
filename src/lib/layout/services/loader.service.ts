import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly loaderVisibilityState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isLoaderVisible$: Observable<boolean> = this.loaderVisibilityState$;

  public setLoaderVisibilityState(value: boolean): void {
    this.loaderVisibilityState$.next(value);
  }

  public showLoader(): void {
    this.setLoaderVisibilityState(true);
  }

  public hideLoader(): void {
    this.setLoaderVisibilityState(false);
  }

  public toggle(): void {
    this.isLoaderVisible$.pipe(take(1)).subscribe((isVisible: boolean) => this.setLoaderVisibilityState(!isVisible));
  }
}

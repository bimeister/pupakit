import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocaleService<T extends string = string> {
  private readonly localeState$: ReplaySubject<T> = new ReplaySubject<T>(1);

  public readonly locale$: Observable<T> = this.localeState$.asObservable().pipe(distinctUntilChanged());

  public setLocale(locale: T): void {
    this.localeState$.next(locale);
  }
}

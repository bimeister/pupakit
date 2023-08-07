import { NgZone } from '@angular/core';
import { Observable, Subscriber, type MonoTypeOperatorFunction } from 'rxjs';

export function subscribeInsideAngular<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) =>
    new Observable<T>((subscriber: Subscriber<T>) =>
      source$.subscribe({
        next: (value: T) => ngZone.run(() => subscriber.next(value)),
        error: (error: unknown) => ngZone.run(() => subscriber.error(error)),
        complete: () => ngZone.run(() => subscriber.complete()),
      })
    );
}

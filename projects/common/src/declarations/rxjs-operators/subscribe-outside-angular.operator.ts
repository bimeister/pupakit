import { NgZone } from '@angular/core';
import { type Nullable } from '@bimeister/utilities';
import { Observable, Subscriber, Subscription, type MonoTypeOperatorFunction } from 'rxjs';

export function subscribeOutsideAngular<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) =>
    new Observable<T>((subscriber: Subscriber<T>) => {
      let subscription: Nullable<Subscription> = null;

      ngZone.runOutsideAngular(() => {
        subscription = source$.subscribe(subscriber);
      });

      return { unsubscribe: () => subscription?.unsubscribe() };
    });
}

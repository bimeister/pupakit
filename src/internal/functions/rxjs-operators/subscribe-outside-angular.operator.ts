import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subscriber, Subscription } from 'rxjs';
import { Nullable } from '@bimeister/utilities';

export function subscribeOutsideAngular<T>(ngZone: NgZone): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>) => {
    return new Observable<T>((subscriber: Subscriber<T>) => {
      let subscription: Nullable<Subscription> = null;

      ngZone.runOutsideAngular(() => {
        subscription = source$.subscribe(subscriber);
      });

      return { unsubscribe: () => subscription?.unsubscribe() };
    });
  };
}

import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export function distinctUntilSerializedChanged<T>(): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>): Observable<T> => {
    return source$.pipe(
      distinctUntilChanged<T>(
        (previousValue: T, currentValue: T) => JSON.stringify(previousValue) === JSON.stringify(currentValue)
      )
    );
  };
}

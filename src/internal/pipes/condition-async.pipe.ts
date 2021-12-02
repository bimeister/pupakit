import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'conditionAsync',
  pure: false,
})
export class ConditionAsyncPipe<T = unknown> implements PipeTransform, OnDestroy {
  private readonly asyncPipe: AsyncPipe = new AsyncPipe(this.injector.get(ChangeDetectorRef));

  constructor(private readonly injector: Injector) {
    this.asyncPipe = new AsyncPipe(injector.get(ChangeDetectorRef));
  }

  public ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
  }

  public transform(booleanValue$: Observable<boolean>, trueArgument: T, falseArgument: T): Nullable<T> {
    if (isNil(booleanValue$)) {
      return null;
    }
    const result$: Observable<T> = booleanValue$.pipe(
      map((booleanValue: unknown) => (Boolean(booleanValue) ? trueArgument : falseArgument))
    );
    return this.asyncPipe.transform<T>(result$);
  }
}

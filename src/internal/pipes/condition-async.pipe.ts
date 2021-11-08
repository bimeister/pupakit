import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { isNil, Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'conditionAsync',
  pure: false
})
export class ConditionAsyncPipe implements PipeTransform, OnDestroy {
  private readonly asyncPipe: AsyncPipe;

  constructor(injector: Injector) {
    this.asyncPipe = new AsyncPipe(injector.get(ChangeDetectorRef));
  }

  public ngOnDestroy(): void {
    this.asyncPipe.ngOnDestroy();
  }

  public transform(booleanValue$: Observable<boolean>, trueArgument: string, falseArgument: string): Nullable<string> {
    if (isNil(booleanValue$)) {
      return null;
    }
    const result$: Observable<string> = booleanValue$.pipe(
      map((booleanValue: unknown) => {
        return Boolean(booleanValue) ? trueArgument : falseArgument;
      })
    );
    return this.asyncPipe.transform(result$);
  }
}

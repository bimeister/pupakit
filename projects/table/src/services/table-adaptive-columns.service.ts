import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TableAdaptiveColumnsService {
  private readonly hasAdaptiveColumnsState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly hasAdaptiveColumns$: Observable<boolean> = this.hasAdaptiveColumnsState$;

  public setHasAdaptiveColumns(hasAdaptiveColumns: boolean): void {
    this.hasAdaptiveColumnsState$.next(hasAdaptiveColumns);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StepperItemComponent } from '../api';

@Injectable()
export class StepperRegistryService<T> {
  private readonly stepperItemsState$: BehaviorSubject<StepperItemComponent<T>[]> = new BehaviorSubject([]);

  public readonly stepperItems$: Observable<StepperItemComponent<T>[]> = this.stepperItemsState$.asObservable();

  public readonly stepperItemsLength$: Observable<number> = this.stepperItems$.pipe(
    map((stepperItems: StepperItemComponent<T>[]) => stepperItems.length)
  );

  public registerStepperItem(stepperItem: StepperItemComponent<T>): void {
    this.stepperItemsState$.pipe(take(1)).subscribe((stepperItems: StepperItemComponent<T>[]) => {
      this.stepperItemsState$.next([...stepperItems, stepperItem]);
    });
  }

  public getStepperItemIndex(stepperItemComponent: StepperItemComponent<T>): Observable<number> {
    return this.stepperItems$.pipe(
      take(1),
      map((stepperItems: StepperItemComponent<T>[]) =>
        stepperItems.findIndex((stepperItem: StepperItemComponent<T>) => stepperItem === stepperItemComponent)
      ),
      map((stepperItemIndex: number) => stepperItemIndex + 1)
    );
  }

  public isLastStepperItem(stepperItemComponent: StepperItemComponent<T>): Observable<boolean> {
    return combineLatest([this.stepperItemsLength$, this.getStepperItemIndex(stepperItemComponent)]).pipe(
      map(([stepperItemsLength, stepperItemIndex]: [number, number]) => stepperItemsLength === stepperItemIndex)
    );
  }
}

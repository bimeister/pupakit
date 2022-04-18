import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StepperItem } from '../../../../internal/declarations/interfaces/stepper-item.interface';

@Injectable()
export class StepperRegistryService<T> {
  private readonly stepperItemsState$: BehaviorSubject<StepperItem<T>[]> = new BehaviorSubject([]);

  public readonly stepperItems$: Observable<StepperItem<T>[]> = this.stepperItemsState$.asObservable();

  public readonly stepperItemsLength$: Observable<number> = this.stepperItems$.pipe(
    map((stepperItems: StepperItem<T>[]) => stepperItems.length)
  );

  public registerStepperItem(stepperItem: StepperItem<T>): void {
    this.stepperItemsState$.pipe(take(1)).subscribe((stepperItems: StepperItem<T>[]) => {
      this.stepperItemsState$.next([...stepperItems, stepperItem]);
    });
  }

  public getStepperItemIndex(stepperItemComponent: StepperItem<T>): Observable<number> {
    return this.stepperItems$.pipe(
      take(1),
      map((stepperItems: StepperItem<T>[]) =>
        stepperItems.findIndex((stepperItem: StepperItem<T>) => stepperItem === stepperItemComponent)
      ),
      map((stepperItemIndex: number) => stepperItemIndex + 1)
    );
  }

  public isLastStepperItem(stepperItemComponent: StepperItem<T>): Observable<boolean> {
    return combineLatest([this.stepperItemsLength$, this.getStepperItemIndex(stepperItemComponent)]).pipe(
      map(([stepperItemsLength, stepperItemIndex]: [number, number]) => stepperItemsLength === stepperItemIndex)
    );
  }
}

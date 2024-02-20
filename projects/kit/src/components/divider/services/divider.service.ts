import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { DividerOrientation } from '../../../declarations/types/divider-orientation.type';

const DIVIDER_DEFAULT_ORIENTATION: DividerOrientation = 'horizontal';

@Injectable()
export class DividerService {
  private readonly orientationState$: BehaviorSubject<DividerOrientation> = new BehaviorSubject<DividerOrientation>(
    DIVIDER_DEFAULT_ORIENTATION
  );

  public readonly orientation$: Observable<DividerOrientation> = this.orientationState$.pipe(distinctUntilChanged());

  public setOrientation(orientation?: DividerOrientation): void {
    this.orientationState$.next(orientation ?? DIVIDER_DEFAULT_ORIENTATION);
  }
}

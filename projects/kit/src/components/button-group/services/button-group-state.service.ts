import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonGroupSize } from '../../../declarations/types/button-group-size.type';
import { TabsServiceBase } from '../../../declarations/classes/abstract/tabs-service-base.abstract';

@Injectable()
export class ButtonGroupStateService<T> extends TabsServiceBase<T> {
  private readonly buttonGroupSizeState$: BehaviorSubject<ButtonGroupSize> = new BehaviorSubject<ButtonGroupSize>('m');
  public readonly buttonGroupSize$: Observable<ButtonGroupSize> = this.buttonGroupSizeState$.asObservable();

  public setButtonGroupSize(size: ButtonGroupSize): void {
    this.buttonGroupSizeState$.next(size);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardSize } from '../../../../internal/declarations/types/card-size.type';

@Injectable()
export class CardStateService {
  public readonly size$: BehaviorSubject<CardSize> = new BehaviorSubject<CardSize>('large');
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly clickable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public setSize(size: CardSize): void {
    this.size$.next(size);
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled$.next(disabled);
  }

  public setClickableState(clickable: boolean): void {
    this.clickable$.next(clickable);
  }
}

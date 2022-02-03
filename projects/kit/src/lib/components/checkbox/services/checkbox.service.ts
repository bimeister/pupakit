import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class CheckboxService {
  public readonly disabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly value$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public readonly indeterminate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly withLabel$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

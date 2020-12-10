import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class SelectTabsService<T> {
  public readonly currentValue$: BehaviorSubject<T> = new BehaviorSubject<T>(null);
}

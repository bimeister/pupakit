import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class CheckboxServiceService {
  public readonly changeValue$: Subject<void> = new Subject();

  public changeValue(): void {
    this.changeValue$.next();
  }
}

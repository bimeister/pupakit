import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TableAdaptiveColumnsService {
  public readonly isAdaptiveColumns$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

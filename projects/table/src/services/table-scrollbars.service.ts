import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TableScrollbarsService {
  public readonly isHorizontalVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isVerticalVisible$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class CalloutService {
  private readonly isClosedState$: Subject<void> = new Subject<void>();
  public readonly isClosed$: Observable<void> = this.isClosedState$.asObservable();

  private readonly isCollapsedState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isCollapsed$: Observable<boolean> = this.isCollapsedState$.asObservable();

  private readonly hasHeaderState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly hasHeader$: Observable<boolean> = this.hasHeaderState$.asObservable();

  public closeCallout(): void {
    this.isClosedState$.next();
  }

  public toggleCalloutCollapse(): void {
    this.isCollapsedState$.pipe(take(1)).subscribe((isCollapsed: boolean) => this.isCollapsedState$.next(!isCollapsed));
  }

  public setHasHeaderToTrue(): void {
    this.hasHeaderState$.next(true);
  }
}

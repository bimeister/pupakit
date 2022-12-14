import { Uuid } from '@bimeister/pupakit.common';
import { getUuid } from '@bimeister/utilities';
import { Observable, Subject, timer } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

import { ToastConfig } from '../interfaces/toast-config.interface';

export class ToastRef<TData = unknown, TReturn = void> {
  public readonly id: Uuid = getUuid();

  private closeDelayMs: number = 0;

  private readonly closeTriggeredSubject$: Subject<TReturn | null> = new Subject<TReturn | null>();
  public readonly closeTriggered$: Observable<TReturn | null> = this.closeTriggeredSubject$.asObservable();

  private readonly closedSubject$: Subject<TReturn | null> = new Subject<TReturn | null>();
  public readonly closed$: Observable<TReturn | null> = this.closedSubject$.pipe(
    delayWhen(() => timer(this.closeDelayMs))
  );

  constructor(public readonly config: ToastConfig<unknown, TData>) {}

  public close(data: TReturn | null = null): void {
    this.closeTriggeredSubject$.next(data);
    this.closeTriggeredSubject$.complete();

    this.closedSubject$.next(data);
    this.closedSubject$.complete();
  }

  public setCloseDelayMs(closeDelayMs: number): void {
    this.closeDelayMs = closeDelayMs;
  }
}

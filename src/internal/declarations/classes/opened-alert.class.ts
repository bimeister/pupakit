import { Observable } from 'rxjs';

import { AlertRef } from './alert-ref.class';

export class OpenedAlert<TReturn = void> {
  public readonly id: string = this.alertRef.id;
  public readonly closeTriggered$: Observable<TReturn> = this.alertRef.closeTriggered$;
  public readonly closed$: Observable<TReturn> = this.alertRef.closed$;

  constructor(private readonly alertRef: AlertRef<unknown, TReturn>) {}

  public close(value: TReturn): void {
    this.alertRef.close(value);
  }
}

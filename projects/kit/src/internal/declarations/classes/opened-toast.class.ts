import { Observable } from 'rxjs';

import { ToastRef } from './toast-ref.class';

export class OpenedToast<TReturn = void> {
  public readonly id: string = this.toastRef.id;
  public readonly closeTriggered$: Observable<TReturn> = this.toastRef.closeTriggered$;
  public readonly closed$: Observable<TReturn> = this.toastRef.closed$;

  constructor(private readonly toastRef: ToastRef<unknown, TReturn>) {}

  public close(value: TReturn): void {
    this.toastRef.close(value);
  }
}

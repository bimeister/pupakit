import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { PopoverConfig } from '../interfaces/popover-config.interface';

export class PopoverRef<TData = unknown, TReturn = void> {
  private readonly closedSubject$: Subject<TReturn | null> = new Subject<TReturn | null>();
  public readonly closed$: Observable<TReturn | null> = this.closedSubject$.asObservable();

  constructor(private readonly overlayRef: OverlayRef, public readonly config: PopoverConfig<unknown, TData>) {}

  public close(data: TReturn = null): void {
    this.overlayRef.dispose();
    this.closedSubject$.next(data);
    this.closedSubject$.complete();
  }
}

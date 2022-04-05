import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';
import { DropdownContainerComponent } from '../../../lib/components/dropdown/components/dropdown-container/dropdown-container.component';
import { DropdownConfig } from '../interfaces/dropdown-config.interface';

export class DropdownRef<TData = unknown> {
  private readonly closedSubject$: Subject<void> = new Subject<void>();
  public readonly closed$: Observable<void> = this.closedSubject$.asObservable();

  constructor(private readonly overlayRef: OverlayRef, public readonly config: DropdownConfig<unknown, TData>) {}

  public close(): void {
    this.overlayRef.dispose();
    this.closedSubject$.next();
    this.closedSubject$.complete();
  }

  public open(componentPortal: ComponentPortal<DropdownContainerComponent>): void {
    this.overlayRef.attach(componentPortal);
  }
}

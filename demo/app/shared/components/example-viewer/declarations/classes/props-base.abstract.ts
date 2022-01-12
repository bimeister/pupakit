import { Directive, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';
import { shareReplayWithRefCount } from '@bimeister/utilities';
import { asyncScheduler, Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { observeOn, takeUntil } from 'rxjs/operators';

@Directive()
export abstract class PropsBase extends Observable<unknown> implements OnDestroy, ControlValueAccessor {
  public readonly formControl: FormControl = new FormControl();

  public subscription: Subscription = new Subscription();
  protected readonly unsubscribe$: Subject<void> = new Subject<void>();
  protected readonly valueChanges$: Observable<unknown> = this.formControl.valueChanges.pipe(
    observeOn(asyncScheduler),
    takeUntil(this.unsubscribe$),
    shareReplayWithRefCount()
  );

  constructor() {
    super((subscriber: Subscriber<unknown>) => this.valueChanges$.subscribe(subscriber));
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.formControl.valueChanges.subscribe(fn);
  }

  public registerOnTouched(_fn: () => void): void {
    // Not implemented
  }

  public writeValue(value: unknown): void {
    this.formControl.setValue(value);
  }
}

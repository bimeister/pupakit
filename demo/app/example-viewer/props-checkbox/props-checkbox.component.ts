import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { asyncScheduler, concat, Observable, of, Subject, Subscriber } from 'rxjs';
import { observeOn, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { getUuid } from '@bimeister/utilities';

@Component({
  selector: 'demo-props-checkbox',
  templateUrl: './props-checkbox.component.html',
  styleUrls: ['./props-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PropsCheckboxComponent,
      multi: true
    }
  ]
})
export class PropsCheckboxComponent extends Observable<unknown> implements ControlValueAccessor {
  public readonly id: string;

  public readonly control: FormControl = new FormControl(false);

  @Output()
  public readonly changes: EventEmitter<unknown> = new EventEmitter<unknown>();

  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  private readonly valueChanges$: Observable<unknown> = concat(of(this.control.value), this.control.valueChanges).pipe(
    observeOn(asyncScheduler),
    takeUntil(this.unsubscribe$),
    tap((newValue: unknown) => this.changes.emit(newValue)),
    shareReplay(1)
  );

  constructor() {
    super((subscriber: Subscriber<unknown>) => {
      return this.valueChanges$.subscribe(subscriber);
    });

    this.id = getUuid();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  public registerOnChange(fn: (change: unknown) => void): void {
    this.control.valueChanges.subscribe(fn);
  }

  public registerOnTouched(_fn: () => void): void {
    // Not implemented
  }

  public writeValue(value: unknown): void {
    this.control.setValue(value);
  }
}

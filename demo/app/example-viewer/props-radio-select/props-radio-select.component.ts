import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  TrackByFunction,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { guidGenerate, isNil } from '@bimeister/utilities/common';
import { asyncScheduler, Observable, Subject, Subscriber } from 'rxjs';
import { observeOn, shareReplay, takeUntil } from 'rxjs/operators';
import { ComponentChanges } from '../../../../src/internal/declarations/interfaces/component-changes.interface';
import { RadioOption } from '../radio-option';

@Component({
  selector: 'demo-props-radio-select',
  templateUrl: './props-radio-select.component.html',
  styleUrls: ['./props-radio-select.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PropsRadioSelectComponent,
      multi: true
    }
  ]
})
export class PropsRadioSelectComponent
  extends Observable<unknown>
  implements OnChanges, OnDestroy, ControlValueAccessor {
  @Input()
  public options: RadioOption[] = [];

  public readonly name: string = guidGenerate();
  public readonly formControl: FormControl = new FormControl();

  private readonly unsubscribe$: Subject<void> = new Subject<void>();
  private readonly valueChanges$: Observable<unknown> = this.formControl.valueChanges.pipe(
    observeOn(asyncScheduler),
    takeUntil(this.unsubscribe$),
    shareReplay(1)
  );

  constructor() {
    super((subscriber: Subscriber<unknown>) => {
      return this.valueChanges$.subscribe(subscriber);
    });
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.options) {
      const currentValue: RadioOption[] = changes.options.currentValue;
      const firstOption: RadioOption = currentValue[0];
      const defaultOption: RadioOption = currentValue.find((option: RadioOption) => option.isDefault);
      const optionToSet: RadioOption = defaultOption ?? firstOption;
      this.formControl.setValue(optionToSet?.value);
    }
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  public generateId(): string {
    return guidGenerate();
  }

  public trackByFn: TrackByFunction<RadioOption> = (index: number, _item: RadioOption) => index;

  public registerOnChange(fn: (value: unknown) => void): void {
    this.formControl.valueChanges.subscribe(fn);
  }

  public registerOnTouched(_fn: () => void): void {
    // Not implemented
  }

  public writeValue(value: unknown): void {
    const targetValue: unknown = this.options.find((option: RadioOption) => option.value === value);
    if (!isNil(targetValue)) {
      return;
    }

    this.formControl.setValue(targetValue);
  }
}

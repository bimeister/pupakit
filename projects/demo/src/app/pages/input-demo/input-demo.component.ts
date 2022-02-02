import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { isEmpty, isNil } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

function getDefaultDateNextMonth(): Date {
  const date: Date = new Date();
  date.setMonth(new Date().getMonth() + 1);
  return date;
}

const REQUIRED_VALIDATOR: ValidatorFn = (control: AbstractControl) => {
  const value: unknown = control.value;
  const isObject: boolean = typeof value === 'object';
  const isEmptyValue: boolean = !Array.isArray(value) && !isObject && isEmpty(value);
  const isEmptyRange: boolean = Array.isArray(value) && value.every((item: unknown) => isNil(item));
  if (isEmptyValue || isEmptyRange || isNil(value)) {
    return { required: true };
  }
  return null;
};

@Component({
  selector: 'demo-input',
  styleUrls: ['input-demo.component.scss'],
  templateUrl: './input-demo.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoComponent implements OnInit, OnDestroy {
  public readonly inputIconFormControl: FormControl = new FormControl('ios-help-circle');
  public readonly placeholderFormControl: FormControl = new FormControl('Custom placeholder');

  public readonly isDisabledFormControl: FormControl = new FormControl(false);

  public readonly sizeOptions: PropsOption[] = [
    {
      caption: 'Large',
      value: 'large',
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true,
    },
    {
      caption: 'Small',
      value: 'small',
    },
  ];

  public readonly validators: ValidatorFn[] = [REQUIRED_VALIDATOR];

  public readonly textControl: FormControl = new FormControl('');
  public readonly passwordControl: FormControl = new FormControl('');
  public readonly numberControl: FormControl = new FormControl('');
  public readonly dateFormControl: FormControl = new FormControl(new Date());
  public readonly dateTimeFormControl: FormControl = new FormControl(new Date());
  public readonly dateTimeSecondsFormControl: FormControl = new FormControl(new Date());
  public readonly timeFormControl: FormControl = new FormControl(new Date());
  public readonly timeSecondsFormControl: FormControl = new FormControl(new Date());
  public readonly rangeFormControl: FormControl = new FormControl([new Date(), getDefaultDateNextMonth()]);
  public readonly rangeDoubleFormControl: FormControl = new FormControl([new Date(), getDefaultDateNextMonth()]);
  public readonly propertyControl: FormControl = new FormControl();
  public readonly controlsList: FormControl[] = [
    this.textControl,
    this.passwordControl,
    this.numberControl,
    this.dateFormControl,
    this.timeFormControl,
    this.dateTimeFormControl,
    this.timeSecondsFormControl,
    this.dateTimeSecondsFormControl,
    this.rangeFormControl,
    this.rangeDoubleFormControl,
  ];
  private readonly isDisabled$: Observable<boolean> = this.propertyControl.statusChanges.pipe(
    map(() => this.propertyControl.disabled)
  );
  private readonly subscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.subscription.add(this.subscribeToIsDisabled());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToIsDisabled(): Subscription {
    return this.isDisabled$.subscribe((isDisabled: boolean) => {
      this.controlsList.forEach((control: FormControl) => (isDisabled ? control.disable() : control.enable()));
    });
  }
}

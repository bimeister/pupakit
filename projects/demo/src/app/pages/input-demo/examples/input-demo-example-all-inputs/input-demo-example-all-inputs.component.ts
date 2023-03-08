import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isDate } from '@bimeister/pupakit.calendar';
import { isEmpty, isNil, Nullable } from '@bimeister/utilities';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
enum ErrorMessageKey {
  Required = 'required',
  InvalidTime = 'invalidTime',
}

const ERROR_MESSAGE_BY_KEY: Map<string, string> = new Map<ErrorMessageKey, string>([
  [ErrorMessageKey.Required, 'Field is required'],
  [ErrorMessageKey.InvalidTime, 'Time is invalid'],
]);

const REQUIRED_VALIDATOR: ValidatorFn = (control: AbstractControl) => {
  const value: unknown = control.value;
  const isObject: boolean = typeof value === 'object';
  const isEmptyValue: boolean = !Array.isArray(value) && !isObject && isEmpty(value);
  const isEmptyRange: boolean = Array.isArray(value) && value.every((item: unknown) => isNil(item));
  if (isEmptyValue || isEmptyRange || isNil(value)) {
    return { [ErrorMessageKey.Required]: true };
  }

  return null;
};

const INVALID_TIME_VALIDATOR: ValidatorFn = (control: AbstractControl) => {
  const value: unknown = control.value;

  if (!isDate(value)) {
    return {
      [ErrorMessageKey.InvalidTime]: true,
    };
  }

  return null;
};

function getDefaultDateNextMonth(): Date {
  const date: Date = new Date();
  date.setMonth(new Date().getMonth() + 1);
  return date;
}

@Component({
  selector: 'demo-input-demo-example-all-inputs',
  templateUrl: './input-demo-example-all-inputs.component.html',
  styleUrls: ['./input-demo-example-all-inputs.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExampleAllInputsComponent {
  private readonly controlByName: Record<string, FormControl> = {
    text: new FormControl('', REQUIRED_VALIDATOR),
    password: new FormControl('', REQUIRED_VALIDATOR),
    number: new FormControl('', REQUIRED_VALIDATOR),
    time: new FormControl(new Date(), [REQUIRED_VALIDATOR, INVALID_TIME_VALIDATOR]),
    date: new FormControl(new Date(), REQUIRED_VALIDATOR),
    dateTime: new FormControl(new Date(), REQUIRED_VALIDATOR),
    dateTimeSeconds: new FormControl(new Date(), REQUIRED_VALIDATOR),
    dateRange: new FormControl([new Date(), getDefaultDateNextMonth()], REQUIRED_VALIDATOR),
    dateRangeDouble: new FormControl([new Date(), getDefaultDateNextMonth()], REQUIRED_VALIDATOR),
  };

  public readonly formGroup: FormGroup = new FormGroup(this.controlByName);

  public readonly errorMessagesByControlName: Record<string, Observable<string[]>> = Object.fromEntries(
    Object.keys(this.controlByName)
      .map((controlName: string) => [controlName, this.controlByName?.[controlName]])
      .filter(
        (item: [string, FormControl | undefined]): item is [string, FormControl] => item[1] instanceof FormControl
      )
      .map(([name, control]: [string, FormControl]) => [name, this.getControlErrorMessages(control)])
  );

  private getControlErrorMessages(control: AbstractControl): Observable<Nullable<string[]>> {
    return control.valueChanges.pipe(
      startWith(control.value),
      map(() => {
        const errors: ValidationErrors = control.errors;

        if (isNil(errors)) {
          return null;
        }

        return Object.keys(errors)
          .filter((key: string) => errors?.[key] ?? false)
          .map((errorKey: string) => ERROR_MESSAGE_BY_KEY.get(errorKey));
      })
    );
  }
}

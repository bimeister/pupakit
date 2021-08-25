import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, AbstractControl, FormGroup } from '@angular/forms';

interface TimeRange {
  min: number;
  max: number;
}

@Component({
  selector: 'pupa-time-input-demo',
  templateUrl: './time-input-demo.component.html',
  styleUrls: ['./time-input-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeInputDemoComponent {
  public hhForm: FormControl = new FormControl('01');
  public mmForm: FormControl = new FormControl('02');
  public ssForm: FormControl = new FormControl('03');
  public formControl: FormControl = new FormControl([], [this.timeValidator({ min: 0, max: 23 }, { min: 0, max: 59 })]);
  public formGroup: FormGroup = new FormGroup({
    hhForm: this.hhForm,
    mmForm: this.mmForm,
    ssForm: this.ssForm
  });
  private enabled: boolean = true;

  constructor() {
    // tslint:disable-next-line: no-console
    this.formControl.valueChanges.subscribe(console.log);
  }

  public setValue(): void {
    this.formControl.setValue([14, 55, 33]);
  }

  public switchEnabled(): void {
    this.enabled = !this.enabled;

    if (this.enabled) {
      this.formControl.enable();
    }
    if (!this.enabled) {
      this.formControl.disable();
    }
  }
  public validate(): void {
    // tslint:disable-next-line: no-console
    console.log(this.formControl.valid);
    // tslint:disable-next-line: no-console
    console.log(this.formControl.value);
  }

  private timeValidator(
    hoursRange: TimeRange,
    minuteRange: TimeRange
  ): (
    ctrl: AbstractControl
  ) => {
    timeValidation: boolean;
  } {
    return (ctrl: AbstractControl) => {
      const timeValue: number[] = ctrl.value;

      if (timeValue) {
        const hourInRange: boolean = hoursRange.min < timeValue[0] && timeValue[0] < hoursRange.max;
        const minutesInRange: boolean = minuteRange.min < timeValue[1] && timeValue[1] < minuteRange.max;

        if (!hourInRange || !minutesInRange) {
          return {
            timeValidation: false
          };
        }
      }

      return {
        timeValidation: true
      };
    };
  }
}

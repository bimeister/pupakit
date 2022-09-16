import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { isNil } from '@bimeister/utilities';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PropsOption } from '../../shared/components/example-viewer/declarations/interfaces/props.option';

const BASE_REQUEST_PATH: string = 'input-demo/examples';

export function isDateCorrect(date: Date): boolean {
  return !Number.isNaN(Date.parse(String(date)));
}

export function dateValidator(control: AbstractControl): { dateCorrect: false } | null {
  return isNil(control.value) || isDateCorrect(control.value) ? null : { dateCorrect: false };
}
@Component({
  selector: 'demo-input',
  styleUrls: ['input-demo.component.scss'],
  templateUrl: './input-demo.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoComponent implements OnInit, OnDestroy {
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
  ];

  public readonly styleOptions: PropsOption[] = [
    {
      caption: 'Inline',
      value: 'inline',
    },
    {
      caption: 'Bold',
      value: 'bold',
    },
    {
      caption: 'Null',
      value: 'null',
      isDefault: true,
    },
  ];

  public readonly iconOptions: PropsOption[] = [
    {
      caption: 'None',
      value: '',
      isDefault: true,
    },
    {
      caption: 'app-admin',
      value: 'app-admin',
    },
    {
      caption: 'app-aim',
      value: 'app-aim',
    },
    {
      caption: 'app-axes',
      value: 'app-axes',
    },
    {
      caption: 'app-camera',
      value: 'app-camera',
    },
    {
      caption: 'app-file-add',
      value: 'app-file-add',
    },
  ];

  public readonly validators: ValidatorFn[] = [Validators.required];
  public readonly dateValidators: ValidatorFn[] = [Validators.required, dateValidator];

  public readonly placeholderFormControl: FormControl = new FormControl('Custom placeholder');
  public readonly tooltipTemplateFormControl: FormControl = new FormControl('<b>Invalid tooltip</b>');
  public readonly tooltipTextFormControl: FormControl = new FormControl('');
  public readonly textControl: FormControl = new FormControl('');
  public readonly timeFormControl: FormControl = new FormControl();
  public readonly dateFormControl: FormControl = new FormControl();
  public readonly endDateFormControl: FormControl = new FormControl(new Date());
  public readonly isDisabledControl: FormControl = new FormControl();

  public readonly controlsList: FormControl[] = [this.textControl, this.timeFormControl, this.dateFormControl];
  private readonly isDisabled$: Observable<boolean> = this.isDisabledControl.statusChanges.pipe(
    map(() => this.isDisabledControl.disabled)
  );
  private readonly subscription: Subscription = new Subscription();

  public readonly sizeExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/input-demo-example-size/input-demo-example-size.component.html`,
    TS: `${BASE_REQUEST_PATH}/input-demo-example-size/input-demo-example-size.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/input-demo-example-size/input-demo-example-size.component.scss`,
  };

  public readonly tooltipExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/input-demo-example-tooltip/input-demo-example-tooltip.component.html`,
    TS: `${BASE_REQUEST_PATH}/input-demo-example-tooltip/input-demo-example-tooltip.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/input-demo-example-tooltip/input-demo-example-tooltip.component.scss`,
  };

  public readonly isPatchedExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/input-demo-example-is-patched/input-demo-example-is-patched.component.html`,
    TS: `${BASE_REQUEST_PATH}/input-demo-example-is-patched/input-demo-example-is-patched.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/input-demo-example-is-patched/input-demo-example-is-patched.component.scss`,
  };

  public readonly allInputsExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/input-demo-example-all-inputs/input-demo-example-all-inputs.component.html`,
    TS: `${BASE_REQUEST_PATH}/input-demo-example-all-inputs/input-demo-example-all-inputs.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/input-demo-example-all-inputs/input-demo-example-all-inputs.component.scss`,
  };

  public readonly withResetExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/input-demo-example-with-reset/input-demo-example-with-reset.component.html`,
    TS: `${BASE_REQUEST_PATH}/input-demo-example-with-reset/input-demo-example-with-reset.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/input-demo-example-with-reset/input-demo-example-with-reset.component.scss`,
  };

  public readonly stylesExampleContent: Record<string, string> = {
    HTML: `${BASE_REQUEST_PATH}/input-demo-example-styles/input-demo-example-styles.component.html`,
    TS: `${BASE_REQUEST_PATH}/input-demo-example-styles/input-demo-example-styles.component.ts`,
    SCSS: `${BASE_REQUEST_PATH}/input-demo-example-styles/input-demo-example-styles.component.scss`,
  };

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

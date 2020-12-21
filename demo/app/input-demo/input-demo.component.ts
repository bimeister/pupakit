import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioOption } from '../example-viewer/radio-option';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'demo-input',
  styleUrls: ['input-demo.component.scss'],
  templateUrl: './input-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDemoComponent {
  public readonly placeholder: string = 'Введите данные';

  public readonly typeOptions: RadioOption[] = [
    {
      caption: 'Text',
      value: 'text'
    },
    {
      caption: 'Password',
      value: 'password'
    },
    {
      caption: 'Number',
      value: 'number'
    }
  ];

  public readonly sizeOptions: RadioOption[] = [
    {
      caption: 'Large',
      value: 'large'
    },
    {
      caption: 'Medium',
      value: 'medium',
      isDefault: true
    },
    {
      caption: 'Small',
      value: 'small'
    }
  ];

  public readonly validators: ValidatorFn[] = [Validators.required, Validators.maxLength(15)];

  public readonly formControl: FormControl = new FormControl('');
}

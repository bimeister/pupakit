import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import combos from 'combos';
// tslint:disable-next-line: import-blacklist
import { compact } from 'lodash';
import { InputSize } from '../../../src/internal/declarations/types/input-size.type';

interface InputCombo {
  size: InputSize;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  transparent: boolean;
  validationOnLength: boolean;
}

const MAX_LENGTH_EXAMPLE: number = 3;

@Component({
  selector: 'demo-input',
  styleUrls: ['../demo.scss', 'input-demo.component.scss'],
  templateUrl: './input-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDemoComponent {
  public readonly switcherThemeControl: FormControl = new FormControl(false);

  public readonly combos: InputCombo[] = combos({
    size: ['medium', 'small', 'large'],
    placeholder: ['placeholder'],
    disabled: [false, true],
    required: [false, true],
    transparent: [false, true],
    validationOnLength: [false, true]
  });

  public readonly inputTextFormArray: FormArray = new FormArray(
    this.combos.map(
      (combo: InputCombo) =>
        new FormControl(
          {
            value: '',
            disabled: combo.disabled
          },
          compact([
            combo.required ? Validators.required : null,
            combo.validationOnLength ? Validators.maxLength(MAX_LENGTH_EXAMPLE) : null
          ])
        )
    )
  );

  public readonly inputPasswordFormArray: FormArray = new FormArray(
    this.combos.map(
      (combo: InputCombo) =>
        new FormControl(
          {
            value: '',
            disabled: combo.disabled
          },
          compact([
            combo.required ? Validators.required : null,
            combo.validationOnLength ? Validators.maxLength(MAX_LENGTH_EXAMPLE) : null
          ])
        )
    )
  );

  public readonly inputDateFormArray: FormArray = new FormArray([
    new FormControl(new Date('11-01-2012')),
    new FormControl(new Date('11-01-2012'))
  ]);

  public readonly inputDateRangeFormArray: FormArray = new FormArray([
    new FormControl([new Date('11-01-2012'), new Date('01-03-2012')]),
    new FormControl([new Date('11-01-2012'), new Date('01-03-2012')])
  ]);

  public readonly inputNumberFormArray: FormArray = new FormArray(
    this.combos.map(
      (combo: InputCombo) =>
        new FormControl(
          {
            value: '',
            disabled: combo.disabled
          },
          compact([
            combo.required ? Validators.required : null,
            combo.validationOnLength ? Validators.maxLength(MAX_LENGTH_EXAMPLE) : null
          ])
        )
    )
  );
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { isNil } from '@bimeister/utilities';
import combos from 'combos';
import { TextareaResize } from '../../../src/internal/declarations/types/textarea-resize.type';

interface TextareaCombo {
  resize: TextareaResize;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  autosize: boolean;
  maxLength: number;
}

const MAX_LENGTH_EXAMPLE: number = 128;

@Component({
  selector: 'demo-textarea',
  styleUrls: ['../demo.scss', './textarea-demo.component.scss'],
  templateUrl: './textarea-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaDemoComponent {
  public readonly combos: TextareaCombo[] = combos({
    resize: ['both', 'vertical', 'horizontal', 'none'],
    placeholder: ['Placeholder text', ''],
    disabled: [false, true],
    required: [false, true],
    autosize: [false, true],
    maxLength: [0, MAX_LENGTH_EXAMPLE]
  });

  public readonly minHeightFormControl: FormControl = new FormControl();
  public readonly minHeightWithAutosizeFormControl: FormControl = new FormControl();

  public readonly formArray: FormArray = new FormArray(
    this.combos.map(
      (combo: TextareaCombo) =>
        new FormControl(
          {
            value: '',
            disabled: combo.disabled
          },
          [
            combo.required ? Validators.required : null,
            combo.maxLength ? Validators.maxLength(combo.maxLength) : null
          ].filter((value: ValidatorFn | null) => !isNil(value))
        )
    )
  );
}

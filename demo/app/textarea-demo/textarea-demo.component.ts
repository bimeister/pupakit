import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import combos from 'combos';
// tslint:disable-next-line: import-blacklist
import { compact } from 'lodash';
import { Subscription } from 'rxjs';

import { TextareaResize } from './../../../src/internal';

interface TextareaCombo {
  resize: TextareaResize;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  maxLength: number;
}

const MAX_LENGTH_EXAMPLE: number = 128;

@Component({
  selector: 'demo-textarea',
  styleUrls: ['../demo.scss', './textarea-demo.scss'],
  templateUrl: './textarea-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaDemoComponent implements OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  public readonly sampleFormControl: FormControl = new FormControl('formControl', Validators.required);
  public value: unknown = null;

  public readonly combos: TextareaCombo[] = combos({
    resize: ['both', 'vertical', 'horizontal', 'none'],
    placeholder: ['Placeholder text', ''],
    disabled: [false, true],
    required: [false, true],
    maxLength: [0, MAX_LENGTH_EXAMPLE]
  });

  public readonly formArray: FormArray = new FormArray(
    this.combos.map(
      (combo: TextareaCombo) =>
        new FormControl(
          '',
          compact([
            combo.required ? Validators.required : null,
            combo.maxLength ? Validators.maxLength(combo.maxLength) : null
          ])
        )
    )
  );

  constructor() {
    /* tslint:disable */
    this.subscription.add(this.sampleFormControl.valueChanges.subscribe((value: unknown) => console.log(value)));
    /* tslint:enable */
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setValue(newValue: unknown): void {
    this.value = newValue;
  }
}

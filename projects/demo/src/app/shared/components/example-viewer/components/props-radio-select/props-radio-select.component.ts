import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentChanges } from '@bimeister/pupakit.common';
import { isNil } from '@bimeister/utilities';
import { PropsBase } from '../../declarations/classes/props-base.abstract';
import { PropsOption } from '../../declarations/interfaces/props.option';

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
      multi: true,
    },
  ],
})
export class PropsRadioSelectComponent extends PropsBase implements OnChanges {
  @Input()
  public options: PropsOption[] = [];

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (!isNil(changes.options)) {
      const currentValue: PropsOption[] = changes.options.currentValue;
      const firstOption: PropsOption = currentValue[0];
      const defaultOption: PropsOption = currentValue.find((option: PropsOption) => option.isDefault);
      const optionToSet: PropsOption = defaultOption ?? firstOption;
      this.formControl.setValue(optionToSet?.value);
    }
  }
}

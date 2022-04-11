import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNil } from '@bimeister/utilities';
import { ComponentChanges } from '@kit/internal/declarations/interfaces/component-changes.interface';
import { Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PropsBase } from '../../declarations/classes/props-base.abstract';
import { PropsOption } from '../../declarations/interfaces/props.option';

@Component({
  selector: 'demo-props-select',
  templateUrl: './props-select.component.html',
  styleUrls: ['./props-select.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PropsSelectComponent,
      multi: true,
    },
  ],
})
export class PropsSelectComponent extends PropsBase implements OnChanges {
  @Input()
  public options: PropsOption[] = [];

  @Input()
  public isMultiSelectionEnabled: boolean = false;

  public subscription: Subscription = new Subscription();

  public caption: string = '';

  constructor() {
    super();

    this.updateCaptionWhenValueChanges();
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (!isNil(changes.options)) {
      const currentValue: PropsOption[] = changes.options.currentValue;
      const firstOption: PropsOption = currentValue[0];
      const defaultOption: PropsOption = currentValue.find((option: PropsOption) => option.isDefault);
      const optionToSet: PropsOption = defaultOption ?? firstOption;
      this.formControl.setValue(this.isMultiSelectionEnabled ? [optionToSet?.value] : optionToSet?.value);
    }
  }

  private updateCaptionWhenValueChanges(): void {
    this.formControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        map((value: string | string[]) => {
          if (Array.isArray(value)) {
            return this.options
              .filter((item: PropsOption) => value.some((valueItem: string) => valueItem === item.value))
              .map((item: PropsOption) => item?.caption)
              .join(', ');
          }
          return this.options.find((item: PropsOption) => item.value === value)?.caption ?? '';
        })
      )
      .subscribe((caption: string) => {
        this.caption = caption;
      });
  }
}

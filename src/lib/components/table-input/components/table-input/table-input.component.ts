import { ChangeDetectionStrategy, Component, Input, Optional, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { isNil } from '@meistersoft/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { OnChangeCallback } from '../../../../../internal/declarations/types/on-change-callback.type';
import { OnTouchedCallback } from '../../../../../internal/declarations/types/on-touched-callback.type';
import { TableInputStateService } from '../../services/table-input-state.service';

@Component({
  selector: 'pupa-table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.component.scss'],
  providers: [TableInputStateService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableInputComponent<T> implements ControlValueAccessor {
  @Input() public readonly placeholder: string = '';

  public readonly value$: BehaviorSubject<string> = this.tableInputStateService.currentValue$;
  public readonly isDisabled$: BehaviorSubject<boolean> = this.tableInputStateService.isDisabled$;
  public readonly isValid$: Observable<boolean> = this.tableInputStateService.isValid$;
  public readonly isTouched$: Observable<boolean> = this.tableInputStateService.isTouched$;

  constructor(@Optional() ngControl: NgControl, private readonly tableInputStateService: TableInputStateService<T>) {
    if (isNil(ngControl)) {
      return;
    }
    ngControl.valueAccessor = this;

    this.tableInputStateService.setControlRef(ngControl);
  }

  public updateValue(value: T): void {
    this.tableInputStateService.updateValue(value);
  }

  public writeValue(newValue: T): void {
    this.tableInputStateService.setValue(newValue);
  }

  public registerOnChange(onChange: OnChangeCallback<T>): void {
    this.tableInputStateService.defineOnChangeCallback(onChange);
  }

  public registerOnTouched(onTouched: OnTouchedCallback): void {
    this.tableInputStateService.defineOnTouchedCallback(onTouched);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.tableInputStateService.setDisabledState(isDisabled);
  }
}

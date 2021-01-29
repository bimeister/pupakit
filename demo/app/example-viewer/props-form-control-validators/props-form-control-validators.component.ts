import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { isNil } from '@bimeister/utilities/commonjs/common';
import { Subscription } from 'rxjs';
import { PropsCheckboxComponent } from '../props-checkbox/props-checkbox.component';

@Component({
  selector: 'demo-props-form-control-validators',
  templateUrl: './props-form-control-validators.component.html',
  styleUrls: ['./props-form-control-validators.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropsFormControlValidatorsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(PropsCheckboxComponent)
  private readonly propsCheckbox: PropsCheckboxComponent;
  private readonly subscription: Subscription = new Subscription();

  @Input()
  public readonly control: FormControl;

  @Input()
  public readonly validators: ValidatorFn[] = [];

  public ngAfterViewInit(): void {
    this.subscription.add(
      this.propsCheckbox.subscribe((attachValidator: boolean) => {
        if (isNil(this.control)) {
          return;
        }

        if (attachValidator) {
          this.control.setValidators(this.validators);
        } else {
          this.control.clearValidators();
        }

        this.control.updateValueAndValidity();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
